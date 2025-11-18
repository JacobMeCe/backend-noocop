import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { PrinterService } from '../printer/printer.service';
import { OrdenCompra } from '../ordenes-compra/entities';
import { Repository } from 'typeorm';
import { Area } from '../areas/entities/area.entity';
import { Proveedor } from '../proveedor/entities/proveedor.entity';
import { Partida } from '../partida/entities/partida.entity';
import { getOrdenCompraReport } from '../reports/getOrdenCompra.report';
import { getProveedoresMesReport } from '../reports/getProveedor.report';
import { getOrdenesCompraMesReport } from '../reports/ordenesdecomprapormes.report';
import { getOrdenesCompraPorEstadoReport } from '../reports/ordenescompraporestado.report';
import { getOrdenesCompraPorAreaReport } from '../reports/ordenescompraporarea.report';

@Injectable()
export class OrdenesCompraReportService
  extends TypeOrmModule
  implements OnModuleInit {
  async onModuleInit() {
    //await this.$connect();
  }

  constructor(
    private readonly printerService: PrinterService,

    @InjectRepository(OrdenCompra)
    private readonly ordenCompraRepository: Repository<OrdenCompra>,
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,
    @InjectRepository(Proveedor)
    private readonly proveedorRepository: Repository<Proveedor>,
    @InjectRepository(Partida)
    private readonly partidaRepository: Repository<Partida>,
  ) {
    super();
  }

  async ordenCompra(ordenCompraId: string) {
    const OrdenCompra = await this.ordenCompraRepository.findOne({
      where: {
        id: ordenCompraId,
      },
      relations: [
        'area',
        'partida',
        'proveedor',
      ],
    });

    if (!OrdenCompra) {
      throw new Error(`Orden de compra not found with id: ${ordenCompraId}`);
    }

    const docDefinition = getOrdenCompraReport({
      OrdenCompra,
    });
    const doc = this.printerService.creatPdf(docDefinition);
    return doc;
  }

  async proveedoresUsadosEnMes(fechaInicio: Date, fechaFin: Date) {
    // Obtener las órdenes de compra dentro del rango de fechas
    const ordenesCompra = await this.ordenCompraRepository
      .createQueryBuilder('orden')
      .leftJoinAndSelect('orden.proveedor', 'proveedor')
      .where('orden.creado_en >= :fechaInicio', { fechaInicio })
      .andWhere('orden.creado_en <= :fechaFin', { fechaFin })
      .andWhere('orden.estado != :eliminada', { eliminada: 'eliminada' })
      .getMany();

    // Si no hay órdenes, intentar obtener algunas para debug
    if (!ordenesCompra || ordenesCompra.length === 0) {
      const todasOrdenes = await this.ordenCompraRepository
        .createQueryBuilder('orden')
        .select(['orden.id', 'orden.creado_en', 'orden.serie_orden', 'orden.folio_orden'])
        .orderBy('orden.creado_en', 'DESC')
        .take(5)
        .getMany();
      throw new Error(
        `No se encontraron órdenes de compra en el rango de fechas especificado (${fechaInicio.toISOString()} - ${fechaFin.toISOString()}). ` +
        `Las últimas órdenes en la base de datos son del: ${todasOrdenes.length > 0 ? todasOrdenes[0].creado_en : 'No hay órdenes'}`
      );
    }

    // Extraer proveedores únicos utilizados en las órdenes
    const proveedoresUsados = new Map<string, any>();

    for (const orden of ordenesCompra) {
      if (orden.proveedor && !proveedoresUsados.has(orden.proveedor.id)) {
        proveedoresUsados.set(orden.proveedor.id, {
          ...orden.proveedor,
          totalOrdenes: 0,
          montoTotal: 0
        });
      }

      if (orden.proveedor) {
        const proveedor = proveedoresUsados.get(orden.proveedor.id);
        proveedor.totalOrdenes += 1;
        proveedor.montoTotal += parseFloat(orden.total.toString());
      }
    }

    const proveedores = Array.from(proveedoresUsados.values());

    if (proveedores.length === 0) {
      throw new Error(`No se encontraron proveedores en el rango de fechas especificado`);
    }

    // Preparar datos para el reporte PDF
    const proveedoresData = proveedores.map(p => ({
      id: p.id,
      codigo_proveedor: p.codigo_proveedor,
      nombre_proveedor: p.nombre_proveedor,
      domicilio: p.domicilio,
      telefono: p.telefono,
      totalOrdenes: p.totalOrdenes,
      montoTotal: parseFloat(p.montoTotal.toFixed(2))
    }));

    // Generar el PDF
    const docDefinition = getProveedoresMesReport({
      fechaInicio,
      fechaFin,
      totalProveedores: proveedores.length,
      totalOrdenes: ordenesCompra.length,
      proveedores: proveedoresData
    });

    const doc = this.printerService.creatPdf(docDefinition);
    return doc;
  }

  async ordenesCompraPorMes(fechaInicio: Date, fechaFin: Date) {
    // Obtener todas las órdenes de compra dentro del rango de fechas
    const ordenesCompra = await this.ordenCompraRepository
      .createQueryBuilder('orden')
      .leftJoinAndSelect('orden.proveedor', 'proveedor')
      .leftJoinAndSelect('orden.area', 'area')
      .leftJoinAndSelect('orden.partida', 'partida')
      .where('orden.creado_en >= :fechaInicio', { fechaInicio })
      .andWhere('orden.creado_en <= :fechaFin', { fechaFin })
      .orderBy('orden.creado_en', 'DESC')
      .getMany();

    // Si no hay órdenes, mostrar información útil
    if (!ordenesCompra || ordenesCompra.length === 0) {
      const todasOrdenes = await this.ordenCompraRepository
        .createQueryBuilder('orden')
        .select(['orden.id', 'orden.creado_en', 'orden.serie_orden', 'orden.folio_orden'])
        .orderBy('orden.creado_en', 'DESC')
        .take(5)
        .getMany();

      throw new Error(
        `No se encontraron órdenes de compra en el rango de fechas especificado (${fechaInicio.toISOString()} - ${fechaFin.toISOString()}). ` +
        `Las últimas órdenes en la base de datos son del: ${todasOrdenes.length > 0 ? todasOrdenes[0].creado_en : 'No hay órdenes'}`
      );
    }

    // Preparar datos para el reporte
    const ordenesData = ordenesCompra.map(orden => ({
      id: orden.id,
      serie_orden: orden.serie_orden,
      folio_orden: orden.folio_orden,
      proveedor_nombre: orden.proveedor?.nombre_proveedor || 'N/A',
      area_nombre: orden.area?.nombre || 'N/A',
      partida_nombre: orden.partida?.nombre_partida || 'N/A',
      aplicacion_destino: orden.aplicacion_destino || 'N/A',
      estado: orden.estado,
      subtotal: parseFloat(orden.subtotal.toString()),
      descuento: parseFloat(orden.descuento.toString()),
      iva: parseFloat(orden.iva.toString()),
      total: parseFloat(orden.total.toString()),
      creado_en: orden.creado_en
    }));

    // Generar el PDF
    const docDefinition = getOrdenesCompraMesReport({
      fechaInicio,
      fechaFin,
      totalOrdenes: ordenesCompra.length,
      ordenes: ordenesData
    });

    const doc = this.printerService.creatPdf(docDefinition);
    return doc;
  }

  async ordenesCompraPorEstado(fechaInicio: Date, fechaFin: Date, estado: string) {
    // Mapear el estado a texto legible
    const estadosMap = {
      'activa': 'Activa',
      'en_proceso': 'En Proceso',
      'completada': 'Completada',
      'cancelada': 'Cancelada',
      'eliminada': 'Eliminada'
    };

    const estadoTexto = estadosMap[estado.toLowerCase()] || estado;

    // Obtener todas las órdenes de compra con el estado especificado
    const ordenesCompra = await this.ordenCompraRepository
      .createQueryBuilder('orden')
      .leftJoinAndSelect('orden.proveedor', 'proveedor')
      .leftJoinAndSelect('orden.area', 'area')
      .leftJoinAndSelect('orden.partida', 'partida')
      .where('orden.creado_en >= :fechaInicio', { fechaInicio })
      .andWhere('orden.creado_en <= :fechaFin', { fechaFin })
      .andWhere('orden.estado = :estado', { estado })
      .orderBy('orden.creado_en', 'DESC')
      .getMany();

    // Si no hay órdenes, mostrar información útil
    if (!ordenesCompra || ordenesCompra.length === 0) {
      throw new Error(
        `No se encontraron órdenes de compra con estado "${estadoTexto}" en el período del ${new Date(fechaInicio).toLocaleDateString('es-MX')} al ${new Date(fechaFin).toLocaleDateString('es-MX')}. ` +
        `El área no tiene órdenes con este estado en las fechas seleccionadas.`
      );
    }

    // Preparar datos para el reporte
    const ordenesData = ordenesCompra.map(orden => ({
      id: orden.id,
      serie_orden: orden.serie_orden,
      folio_orden: orden.folio_orden,
      proveedor_nombre: orden.proveedor?.nombre_proveedor || 'N/A',
      area_nombre: orden.area?.nombre || 'N/A',
      partida_nombre: orden.partida?.nombre_partida || 'N/A',
      aplicacion_destino: orden.aplicacion_destino || 'N/A',
      estado: orden.estado,
      subtotal: parseFloat(orden.subtotal.toString()),
      descuento: parseFloat(orden.descuento.toString()),
      iva: parseFloat(orden.iva.toString()),
      total: parseFloat(orden.total.toString()),
      creado_en: orden.creado_en
    }));

    // Generar el PDF
    const docDefinition = getOrdenesCompraPorEstadoReport({
      fechaInicio,
      fechaFin,
      estado,
      totalOrdenes: ordenesCompra.length,
      ordenes: ordenesData
    });

    const doc = this.printerService.creatPdf(docDefinition);
    return doc;
  }

  async ordenesCompraPorArea(fechaInicio: Date, fechaFin: Date, area_id: string) {
    // Primero verificar si el área existe
    const area = await this.areaRepository.findOne({
      where: { id: area_id }
    });

    if (!area) {
      throw new Error(`El área con ID "${area_id}" no existe en el sistema.`);
    }

    // Obtener todas las órdenes de compra del área especificada
    const ordenesCompra = await this.ordenCompraRepository
      .createQueryBuilder('orden')
      .leftJoinAndSelect('orden.proveedor', 'proveedor')
      .leftJoinAndSelect('orden.area', 'area')
      .leftJoinAndSelect('orden.partida', 'partida')
      .where('orden.creado_en >= :fechaInicio', { fechaInicio })
      .andWhere('orden.creado_en <= :fechaFin', { fechaFin })
      .andWhere('orden.area_id = :area_id', { area_id })
      .orderBy('orden.creado_en', 'DESC')
      .getMany();

    // Si no hay órdenes, mostrar información útil con el nombre del área
    if (!ordenesCompra || ordenesCompra.length === 0) {
      throw new Error(
        `El área "${area.nombre}" no tiene órdenes de compra en el período del ${new Date(fechaInicio).toLocaleDateString('es-MX')} al ${new Date(fechaFin).toLocaleDateString('es-MX')}. ` +
        `Por favor, seleccione otro rango de fechas o verifique que el área tenga órdenes registradas.`
      );
    }

    // Obtener el nombre del área
    const area_nombre = area.nombre;

    // Preparar datos para el reporte
    const ordenesData = ordenesCompra.map(orden => ({
      id: orden.id,
      serie_orden: orden.serie_orden,
      folio_orden: orden.folio_orden,
      proveedor_nombre: orden.proveedor?.nombre_proveedor || 'N/A',
      area_nombre: orden.area?.nombre || 'N/A',
      partida_nombre: orden.partida?.nombre_partida || 'N/A',
      aplicacion_destino: orden.aplicacion_destino || 'N/A',
      estado: orden.estado,
      subtotal: parseFloat(orden.subtotal.toString()),
      descuento: parseFloat(orden.descuento.toString()),
      iva: parseFloat(orden.iva.toString()),
      total: parseFloat(orden.total.toString()),
      creado_en: orden.creado_en
    }));

    // Generar el PDF
    const docDefinition = getOrdenesCompraPorAreaReport({
      fechaInicio,
      fechaFin,
      area_id,
      area_nombre,
      totalOrdenes: ordenesCompra.length,
      ordenes: ordenesData
    });

    const doc = this.printerService.creatPdf(docDefinition);
    return doc;
  }


}
