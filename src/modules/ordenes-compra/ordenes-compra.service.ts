import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { isUUID } from 'class-validator';

import { CreateOrdenCompraDto } from './dto/create-orden-compra.dto';
import { UpdateOrdenCompraDto } from './dto/update-orden-compra.dto';
import { OrdenCompra, EstadoOrdenCompra } from './entities/ordenes-compra.entity';
import { ProductoOrdenCompra } from './entities/producto-orden-compra.entity';
import { Proveedor } from '../proveedor/entities/proveedor.entity';
import { Area } from '../areas/entities/area.entity';
import { Partida } from '../partida/entities/partida.entity';
import { PaginationDto } from '../../common/dtos/pagination.dto';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class OrdenesCompraService {
  private readonly logger = new Logger('OrdenesCompraService');

  constructor(
    @InjectRepository(OrdenCompra)
    private ordenCompraRepository: Repository<OrdenCompra>,

    @InjectRepository(ProductoOrdenCompra)
    private productoOrdenRepository: Repository<ProductoOrdenCompra>,

    @InjectRepository(Proveedor)
    private proveedorRepository: Repository<Proveedor>,

    @InjectRepository(Area)
    private areaRepository: Repository<Area>,

    @InjectRepository(Partida)
    private partidaRepository: Repository<Partida>,
  ) { }

  async create(createOrdenCompraDto: CreateOrdenCompraDto, user: User): Promise<OrdenCompra> {
    try {
      // Validar existencia de proveedor, área y partida
      await this.validarEntidadesRelacionadas(
        createOrdenCompraDto.proveedor_id,
        createOrdenCompraDto.area_id,
        createOrdenCompraDto.partida_id
      );

      // Validar que no existe una orden con la misma serie y folio
      await this.validarSerieYFolio(createOrdenCompraDto.serie_orden, createOrdenCompraDto.folio_orden);

      // Crear la orden
      const orden = this.ordenCompraRepository.create({
        serie_orden: createOrdenCompraDto.serie_orden,
        folio_orden: createOrdenCompraDto.folio_orden,
        proveedor_id: createOrdenCompraDto.proveedor_id,
        area_id: createOrdenCompraDto.area_id,
        partida_id: createOrdenCompraDto.partida_id,
        aplicacion_destino: createOrdenCompraDto.aplicacion_destino,
        porcentaje_descuento: createOrdenCompraDto.porcentaje_descuento || 0,
        estado: EstadoOrdenCompra.ACTIVA,
        creado_por_id: user?.id
      });

      const ordenGuardada = await this.ordenCompraRepository.save(orden);

      // Crear los productos
      const productos = createOrdenCompraDto.productos.map(producto => {
        const productoOrden = this.productoOrdenRepository.create({
          ...producto,
          orden_compra_id: ordenGuardada.id,
          desglosar_iva: producto.desglosar_iva ?? true
        });

        // Calcular IVA y total del producto
        if (productoOrden.desglosar_iva) {
          productoOrden.iva_producto = productoOrden.importe * 0.16;
          productoOrden.total_producto = productoOrden.importe + productoOrden.iva_producto;
        } else {
          productoOrden.iva_producto = 0;
          productoOrden.total_producto = productoOrden.importe;
        }

        return productoOrden;
      });

      await this.productoOrdenRepository.save(productos);

      // Calcular totales de la orden
      await this.calcularTotalesOrden(ordenGuardada.id);

      // Retornar la orden completa
      return this.findOne(ordenGuardada.id);

    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(paginationDto: PaginationDto, estado?: EstadoOrdenCompra): Promise<any> {
    const { limit = 10, offset = 0 } = paginationDto;

    const queryBuilder = this.ordenCompraRepository.createQueryBuilder('orden')
      .leftJoinAndSelect('orden.proveedor', 'proveedor')
      .leftJoinAndSelect('orden.area', 'area')
      .leftJoinAndSelect('orden.partida', 'partida')
      .leftJoinAndSelect('orden.productos', 'productos')
      .leftJoinAndSelect('orden.creado_por', 'creado_por');

    // Filtrar por estado si se proporciona
    if (estado) {
      queryBuilder.where('orden.estado = :estado', { estado });
    } else {
      // Por defecto, excluir las órdenes eliminadas
      queryBuilder.where('orden.estado != :estado', { estado: EstadoOrdenCompra.ELIMINADA });
    }

    const [data, count] = await queryBuilder
      .orderBy('orden.creado_en', 'DESC')
      .take(limit)
      .skip(offset)
      .getManyAndCount();

    return {
      data: data.map(orden => this.mapearRespuestaOrden(orden)),
      meta: {
        totalItems: count,
        limit,
        offset,
        totalPages: Math.ceil(count / limit),
        currentPage: Math.floor(offset / limit) + 1,
      }
    };
  }

  async findOne(id: string): Promise<any> {
    if (!isUUID(id)) {
      throw new BadRequestException('El ID proporcionado no es válido');
    }

    const orden = await this.ordenCompraRepository.findOne({
      where: { id, estado: Not(EstadoOrdenCompra.ELIMINADA) },
      relations: ['proveedor', 'area', 'partida', 'productos', 'creado_por']
    });

    if (!orden) {
      throw new NotFoundException(`Orden de compra con ID ${id} no encontrada`);
    }

    return this.mapearRespuestaOrden(orden);
  }

  async findBySerieYFolio(serie: string, folio: string): Promise<OrdenCompra> {
    const orden = await this.ordenCompraRepository.findOne({
      where: {
        serie_orden: serie,
        folio_orden: folio,
        estado: Not(EstadoOrdenCompra.ELIMINADA)
      },
      relations: ['proveedor', 'area', 'partida', 'productos']
    });

    if (!orden) {
      throw new NotFoundException(`Orden de compra ${serie}-${folio} no encontrada`);
    }

    return orden;
  }

  async update(id: string, updateOrdenCompraDto: UpdateOrdenCompraDto): Promise<OrdenCompra> {
    try {
      this.logger.log(`Iniciando actualización de orden ${id}`);

      // Validar UUID
      if (!isUUID(id)) {
        throw new BadRequestException('El ID proporcionado no es válido');
      }

      // Usar transacción para garantizar consistencia
      return await this.ordenCompraRepository.manager.transaction(async manager => {
        // 1. Obtener orden existente
        const orden = await manager.findOne(OrdenCompra, {
          where: { id, estado: Not(EstadoOrdenCompra.ELIMINADA) },
          relations: ['productos']
        });

        if (!orden) {
          throw new NotFoundException(`Orden de compra con ID ${id} no encontrada`);
        }

        // 2. Validar estado
        if (orden.estado === EstadoOrdenCompra.COMPLETADA) {
          throw new BadRequestException('No se puede modificar una orden completada');
        }
        if (orden.estado === EstadoOrdenCompra.CANCELADA) {
          throw new BadRequestException('No se puede modificar una orden cancelada');
        }

        // 3. Validar entidades relacionadas si se proporcionan
        if (updateOrdenCompraDto.proveedor_id || updateOrdenCompraDto.area_id || updateOrdenCompraDto.partida_id) {
          await this.validarEntidadesRelacionadas(
            updateOrdenCompraDto.proveedor_id || orden.proveedor_id,
            updateOrdenCompraDto.area_id || orden.area_id,
            updateOrdenCompraDto.partida_id || orden.partida_id
          );
        }

        // 4. Validar serie y folio únicos si se modifican
        if (updateOrdenCompraDto.serie_orden || updateOrdenCompraDto.folio_orden) {
          const nuevaSerie = updateOrdenCompraDto.serie_orden || orden.serie_orden;
          const nuevoFolio = updateOrdenCompraDto.folio_orden || orden.folio_orden;

          if (nuevaSerie !== orden.serie_orden || nuevoFolio !== orden.folio_orden) {
            const ordenExistente = await manager.findOne(OrdenCompra, {
              where: {
                serie_orden: nuevaSerie,
                folio_orden: nuevoFolio,
                estado: Not(EstadoOrdenCompra.ELIMINADA),
                id: Not(id)
              }
            });

            if (ordenExistente) {
              throw new BadRequestException(`Ya existe otra orden con la serie ${nuevaSerie} y folio ${nuevoFolio}`);
            }
          }
        }

        // 5. Actualizar productos si se proporcionan
        if (updateOrdenCompraDto.productos && Array.isArray(updateOrdenCompraDto.productos)) {
          // Eliminar productos existentes
          await manager.delete(ProductoOrdenCompra, { orden_compra_id: id });

          // Crear y validar nuevos productos
          if (updateOrdenCompraDto.productos.length > 0) {
            const productosNuevos = [];

            for (let i = 0; i < updateOrdenCompraDto.productos.length; i++) {
              const producto = updateOrdenCompraDto.productos[i];

              // Validaciones
              if (!producto.cantidad || producto.cantidad <= 0) {
                throw new BadRequestException(`Producto ${i + 1}: La cantidad debe ser mayor a 0`);
              }
              if (producto.importe === undefined || producto.importe < 0) {
                throw new BadRequestException(`Producto ${i + 1}: El importe debe ser mayor o igual a 0`);
              }
              if (!producto.descripcion?.trim()) {
                throw new BadRequestException(`Producto ${i + 1}: La descripción es requerida`);
              }
              if (!producto.unidad?.trim()) {
                throw new BadRequestException(`Producto ${i + 1}: La unidad es requerida`);
              }
              if (producto.costo_sin_iva === undefined || producto.costo_sin_iva < 0) {
                throw new BadRequestException(`Producto ${i + 1}: El costo sin IVA debe ser mayor o igual a 0`);
              }

              // Crear producto con cálculos
              const productoNuevo = manager.create(ProductoOrdenCompra, {
                orden_compra_id: id,
                cantidad: producto.cantidad,
                unidad: producto.unidad.trim(),
                descripcion: producto.descripcion.trim(),
                costo_sin_iva: Number(producto.costo_sin_iva),
                importe: Number(producto.importe),
                desglosar_iva: producto.desglosar_iva ?? true
              });

              // Calcular IVA y total
              if (productoNuevo.desglosar_iva) {
                productoNuevo.iva_producto = Math.round((productoNuevo.importe * 0.16) * 100) / 100;
              } else {
                productoNuevo.iva_producto = 0;
              }
              productoNuevo.total_producto = productoNuevo.importe + productoNuevo.iva_producto;

              productosNuevos.push(productoNuevo);
            }

            // Guardar todos los productos
            await manager.save(ProductoOrdenCompra, productosNuevos);
          }
        }

        // 6. Actualizar campos básicos de la orden (excluyendo productos)
        const { productos, ...camposActualizar } = updateOrdenCompraDto;

        if (Object.keys(camposActualizar).length > 0) {
          await manager.update(OrdenCompra, id, {
            ...camposActualizar,
            actualizado_en: new Date()
          });
        }

        // 7. Recalcular totales
        const productosFinales = await manager.find(ProductoOrdenCompra, {
          where: { orden_compra_id: id }
        });

        // Obtener la orden actualizada para usar el porcentaje de descuento actual
        const ordenActualizada = await manager.findOne(OrdenCompra, { where: { id } });

        const subtotal = productosFinales.reduce((sum, p) => sum + Number(p.importe), 0);
        const porcentajeDescuento = Number(ordenActualizada.porcentaje_descuento) || 0;
        const descuento = Math.round((subtotal * (porcentajeDescuento / 100)) * 100) / 100;
        const subtotalConDescuento = subtotal - descuento;
        const iva = productosFinales.reduce((sum, p) => sum + Number(p.iva_producto), 0);
        const total = Math.round((subtotalConDescuento + iva) * 100) / 100;

        // Actualizar totales en la orden
        await manager.update(OrdenCompra, id, {
          subtotal: Math.round(subtotal * 100) / 100,
          descuento,
          iva: Math.round(iva * 100) / 100,
          total
        });

        // 8. Retornar orden completa actualizada
        const ordenFinal = await manager.findOne(OrdenCompra, {
          where: { id },
          relations: ['proveedor', 'area', 'partida', 'productos']
        });

        this.logger.log(`✅ Orden ${id} actualizada exitosamente`);
        return ordenFinal;
      });

    } catch (error) {
      this.logger.error(`❌ Error al actualizar orden ${id}:`, error);
      this.handleDBException(error);
    }
  }

  async cambiarEstado(id: string, nuevoEstado: EstadoOrdenCompra): Promise<OrdenCompra> {
    const orden = await this.findOne(id);

    // Validar transiciones de estado
    this.validarTransicionEstado(orden.estado, nuevoEstado);

    orden.estado = nuevoEstado;
    await this.ordenCompraRepository.save(orden);

    return this.findOne(id);
  }

  async cancelar(id: string): Promise<OrdenCompra> {
    return this.cambiarEstado(id, EstadoOrdenCompra.CANCELADA);
  }

  async completar(id: string): Promise<OrdenCompra> {
    return this.cambiarEstado(id, EstadoOrdenCompra.COMPLETADA);
  }

  async remove(id: string): Promise<void> {
    const orden = await this.findOne(id);

    if (orden.estado === EstadoOrdenCompra.COMPLETADA) {
      throw new BadRequestException('No se puede eliminar una orden completada');
    }

    // Soft delete - cambiar estado a eliminada
    orden.estado = EstadoOrdenCompra.ELIMINADA;
    await this.ordenCompraRepository.save(orden);
  }

  async hardDelete(id: string): Promise<void> {
    const orden = await this.ordenCompraRepository.findOne({ where: { id } });

    if (!orden) {
      throw new NotFoundException(`Orden de compra con ID ${id} no encontrada`);
    }

    // Eliminar productos asociados
    await this.productoOrdenRepository.delete({ orden_compra_id: id });

    // Eliminar la orden
    await this.ordenCompraRepository.remove(orden);
  }

  // Métodos privados de utilidad

  private async validarEntidadesRelacionadas(
    proveedorId: string,
    areaId: string,
    partidaId: string
  ): Promise<void> {
    const [proveedor, area, partida] = await Promise.all([
      this.proveedorRepository.findOne({ where: { id: proveedorId } }),
      this.areaRepository.findOne({ where: { id: areaId } }),
      this.partidaRepository.findOne({ where: { id: partidaId } })
    ]);

    if (!proveedor) {
      throw new NotFoundException(`Proveedor con ID ${proveedorId} no encontrado`);
    }

    if (!area) {
      throw new NotFoundException(`Área con ID ${areaId} no encontrada`);
    }

    if (!partida) {
      throw new NotFoundException(`Partida con ID ${partidaId} no encontrada`);
    }
  }

  private async validarSerieYFolio(serie: string, folio: string): Promise<void> {
    const ordenExistente = await this.ordenCompraRepository.findOne({
      where: {
        serie_orden: serie,
        folio_orden: folio,
        estado: Not(EstadoOrdenCompra.ELIMINADA)
      }
    });

    if (ordenExistente) {
      throw new BadRequestException(`Ya existe una orden con la serie ${serie} y folio ${folio}`);
    }
  }

  private validarTransicionEstado(estadoActual: EstadoOrdenCompra, nuevoEstado: EstadoOrdenCompra): void {
    const transicionesValidas = {
      [EstadoOrdenCompra.ACTIVA]: [EstadoOrdenCompra.EN_PROCESO, EstadoOrdenCompra.CANCELADA, EstadoOrdenCompra.ELIMINADA],
      [EstadoOrdenCompra.EN_PROCESO]: [EstadoOrdenCompra.COMPLETADA, EstadoOrdenCompra.CANCELADA],
      [EstadoOrdenCompra.COMPLETADA]: [], // Una vez completada, no se puede cambiar
      [EstadoOrdenCompra.CANCELADA]: [EstadoOrdenCompra.ACTIVA], // Solo se puede reactivar
      [EstadoOrdenCompra.ELIMINADA]: [] // Una vez eliminada, no se puede cambiar
    };

    if (!transicionesValidas[estadoActual].includes(nuevoEstado)) {
      throw new BadRequestException(
        `No se puede cambiar el estado de ${estadoActual} a ${nuevoEstado}`
      );
    }
  }

  private async calcularTotalesOrden(ordenId: string): Promise<void> {
    const productos = await this.productoOrdenRepository.find({
      where: { orden_compra_id: ordenId }
    });

    const subtotal = productos.reduce((total, producto) => total + Number(producto.importe), 0);

    const orden = await this.ordenCompraRepository.findOne({ where: { id: ordenId } });
    const porcentajeDescuento = Number(orden.porcentaje_descuento) || 0;

    const descuento = subtotal * (porcentajeDescuento / 100);
    const subtotalConDescuento = subtotal - descuento;

    const iva = productos.reduce((total, producto) => total + Number(producto.iva_producto), 0);
    const total = subtotalConDescuento + iva;

    // Actualizar totales en la orden
    await this.ordenCompraRepository.update(ordenId, {
      subtotal,
      descuento,
      iva,
      total
    });
  }

  private mapearRespuestaOrden(orden: OrdenCompra): any {
    return {
      ...orden,
      numero_orden: `${orden.serie_orden}-${orden.folio_orden}`
    };
  }

  private handleDBException(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    if (error.status >= 400 && error.status < 500) {
      throw error;
    }

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Error inesperado del servidor. Intente nuevamente más tarde.'
    );
  }
}
