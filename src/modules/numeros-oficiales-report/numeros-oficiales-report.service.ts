import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { PrinterService } from '../printer/printer.service';
import { NumerosOficiale } from '../numeros-oficiales/entities/numeros-oficiale.entity';
import { Repository, Between } from 'typeorm';
import { getNumerosOficialesReport } from '../reports/getNumerosOficiales.report';
import { getNumerosOficialesPorMesReport } from '../reports/numerosOficialesPorMes.report';
import ExcelJS from 'exceljs';

@Injectable()
export class NumerosOficialesReportService
    extends TypeOrmModule
    implements OnModuleInit {
    async onModuleInit() {
        //await this.$connect();
    }

    constructor(
        private readonly printerService: PrinterService,

        @InjectRepository(NumerosOficiale)
        private readonly numerosOficialeRepository: Repository<NumerosOficiale>,
    ) {
        super();
    }

    async printNumeroOficial(numeroOficialeId: string) {
        const numeroOficiale = await this.numerosOficialeRepository.findOne({
            where: { id: numeroOficialeId },
        });

        if (!numeroOficiale) {
            throw new Error('Número oficial no encontrado');
        }

        const docDefinition = getNumerosOficialesReport({
            numeroOficiale,
        });
        const doc = this.printerService.creatPdf(docDefinition);
        return doc;
    }

    async printNumerosOficialesPorMes(fechaInicio: Date, fechaFin: Date) {
        if (!fechaInicio || !fechaFin) {
            throw new Error('Fechas inválidas');
        }

        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);

        inicio.setHours(0, 0, 0, 0);
        fin.setHours(23, 59, 59, 999);

        const numerosOficiales = await this.numerosOficialeRepository.find({
            where: {
                createdAt: Between(inicio, fin),
            },
            order: { createdAt: 'DESC' },
        });

        const docDefinition = getNumerosOficialesPorMesReport({
            numerosOficiales,
            fechaInicio: inicio,
            fechaFin: fin,
        });
        const doc = this.printerService.creatPdf(docDefinition);
        return doc;
    }

    async printNumerosOficialesTodos() {
        const numerosOficiales = await this.numerosOficialeRepository.find({
            order: { createdAt: 'DESC' },
        });

        const rangoInicio = numerosOficiales.length ? new Date(numerosOficiales[numerosOficiales.length - 1].createdAt) : new Date(0);
        const rangoFin = numerosOficiales.length ? new Date(numerosOficiales[0].createdAt) : new Date();

        const docDefinition = getNumerosOficialesPorMesReport({
            numerosOficiales,
            fechaInicio: rangoInicio,
            fechaFin: rangoFin,
        });
        const doc = this.printerService.creatPdf(docDefinition);
        return doc;
    }

    async exportAllToExcel(): Promise<{ buffer: Buffer; filename: string }> {
        const registros = await this.numerosOficialeRepository.find({ order: { createdAt: 'DESC' } });

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Numeros Oficiales');

        sheet.columns = [
            { header: 'ID', key: 'id', width: 36 },
            { header: 'Número Folio', key: 'numeroFolio', width: 20 },
            { header: 'Cuenta Predial', key: 'CtaPredial', width: 20 },
            { header: 'Clave Catastral', key: 'claveCatastral', width: 22 },
            { header: 'Dirección', key: 'direccion', width: 40 },
            { header: 'Colonia', key: 'colonia', width: 22 },
            { header: 'Uso de Suelo', key: 'usoSuelo', width: 20 },
            { header: 'Otro', key: 'otro', width: 20 },
            { header: 'Nombre Propietario', key: 'nombrePropietario', width: 28 },
            { header: 'Domicilio Propietario', key: 'domicilioPropietario', width: 40 },
            { header: 'Teléfono Propietario', key: 'telefonoPropietario', width: 20 },
            { header: 'Entre Calle Norte', key: 'entreCalleNorte', width: 20 },
            { header: 'Entre Calle Sur', key: 'entreCalleSur', width: 20 },
            { header: 'Entre Calle Este', key: 'entreCalleEste', width: 20 },
            { header: 'Entre Calle Oeste', key: 'entreCalleOeste', width: 20 },
            { header: 'Frente Lote', key: 'frenteLote', width: 16 },
            { header: 'Dist. Esq. Derecha', key: 'distanciaEsquinaDerecha', width: 18 },
            { header: 'Dist. Esq. Izquierda', key: 'distanciaEsquinaIzquierda', width: 18 },
            { header: 'Observaciones', key: 'observaciones', width: 40 },
            { header: 'Número Oficial Asignado', key: 'numeroOficialAsignado', width: 24 },
            { header: 'Derechos', key: 'derechos', width: 14 },
            { header: 'Forma', key: 'forma', width: 14 },
            { header: 'Importe Total', key: 'importeTotal', width: 16 },
            { header: 'Creado', key: 'createdAt', width: 22 },
            { header: 'Actualizado', key: 'updatedAt', width: 22 },
            { header: 'Created By ID', key: 'createdById', width: 36 },
            { header: 'Updated By ID', key: 'updatedById', width: 36 },
        ];

        for (const r of registros) {
            sheet.addRow({
                id: r.id,
                numeroFolio: r.numeroFolio,
                CtaPredial: r.CtaPredial,
                claveCatastral: r.claveCatastral,
                direccion: r.direccion,
                colonia: r.colonia,
                usoSuelo: r.usoSuelo,
                otro: r.otro ?? '',
                nombrePropietario: r.nombrePropietario,
                domicilioPropietario: r.domicilioPropietario,
                telefonoPropietario: r.telefonoPropietario ?? '',
                entreCalleNorte: r.entreCalleNorte ?? '',
                entreCalleSur: r.entreCalleSur ?? '',
                entreCalleEste: r.entreCalleEste ?? '',
                entreCalleOeste: r.entreCalleOeste ?? '',
                frenteLote: r.frenteLote ?? '',
                distanciaEsquinaDerecha: r.distanciaEsquinaDerecha ?? '',
                distanciaEsquinaIzquierda: r.distanciaEsquinaIzquierda ?? '',
                observaciones: r.observaciones ?? '',
                numeroOficialAsignado: r.numeroOficialAsignado ?? '',
                derechos: r.derechos,
                forma: r.forma,
                importeTotal: r.importeTotal,
                createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : '',
                updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : '',
                createdById: r.createdById ?? '',
                updatedById: r.updatedById ?? '',
            });
        }

        // Freeze header row and add basic style
        const header = sheet.getRow(1);
        header.font = { bold: true } as any;
        header.alignment = { vertical: 'middle', horizontal: 'center' } as any;

        const buffer = await workbook.xlsx.writeBuffer();
        const filename = `numeros_oficiales_${new Date().toISOString().slice(0, 10)}.xlsx`;
        return { buffer: Buffer.from(buffer), filename };
    }

    async exportByDatesToExcel(fechaInicio: Date, fechaFin: Date): Promise<{ buffer: Buffer; filename: string }> {
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);

        inicio.setHours(0, 0, 0, 0);
        fin.setHours(23, 59, 59, 999);

        const registros = await this.numerosOficialeRepository.find({
            where: { createdAt: Between(inicio, fin) },
            order: { createdAt: 'DESC' },
        });

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Numeros Oficiales');

        sheet.columns = [
            { header: 'ID', key: 'id', width: 36 },
            { header: 'Número Folio', key: 'numeroFolio', width: 20 },
            { header: 'Cuenta Predial', key: 'CtaPredial', width: 20 },
            { header: 'Clave Catastral', key: 'claveCatastral', width: 22 },
            { header: 'Dirección', key: 'direccion', width: 40 },
            { header: 'Colonia', key: 'colonia', width: 22 },
            { header: 'Uso de Suelo', key: 'usoSuelo', width: 20 },
            { header: 'Otro', key: 'otro', width: 20 },
            { header: 'Nombre Propietario', key: 'nombrePropietario', width: 28 },
            { header: 'Domicilio Propietario', key: 'domicilioPropietario', width: 40 },
            { header: 'Teléfono Propietario', key: 'telefonoPropietario', width: 20 },
            { header: 'Entre Calle Norte', key: 'entreCalleNorte', width: 20 },
            { header: 'Entre Calle Sur', key: 'entreCalleSur', width: 20 },
            { header: 'Entre Calle Este', key: 'entreCalleEste', width: 20 },
            { header: 'Entre Calle Oeste', key: 'entreCalleOeste', width: 20 },
            { header: 'Frente Lote', key: 'frenteLote', width: 16 },
            { header: 'Dist. Esq. Derecha', key: 'distanciaEsquinaDerecha', width: 18 },
            { header: 'Dist. Esq. Izquierda', key: 'distanciaEsquinaIzquierda', width: 18 },
            { header: 'Observaciones', key: 'observaciones', width: 40 },
            { header: 'Número Oficial Asignado', key: 'numeroOficialAsignado', width: 24 },
            { header: 'Derechos', key: 'derechos', width: 14 },
            { header: 'Forma', key: 'forma', width: 14 },
            { header: 'Importe Total', key: 'importeTotal', width: 16 },
            { header: 'Creado', key: 'createdAt', width: 22 },
            { header: 'Actualizado', key: 'updatedAt', width: 22 },
            { header: 'Created By ID', key: 'createdById', width: 36 },
            { header: 'Updated By ID', key: 'updatedById', width: 36 },
        ];

        for (const r of registros) {
            sheet.addRow({
                id: r.id,
                numeroFolio: r.numeroFolio,
                CtaPredial: r.CtaPredial,
                claveCatastral: r.claveCatastral,
                direccion: r.direccion,
                colonia: r.colonia,
                usoSuelo: r.usoSuelo,
                otro: r.otro ?? '',
                nombrePropietario: r.nombrePropietario,
                domicilioPropietario: r.domicilioPropietario,
                telefonoPropietario: r.telefonoPropietario ?? '',
                entreCalleNorte: r.entreCalleNorte ?? '',
                entreCalleSur: r.entreCalleSur ?? '',
                entreCalleEste: r.entreCalleEste ?? '',
                entreCalleOeste: r.entreCalleOeste ?? '',
                frenteLote: r.frenteLote ?? '',
                distanciaEsquinaDerecha: r.distanciaEsquinaDerecha ?? '',
                distanciaEsquinaIzquierda: r.distanciaEsquinaIzquierda ?? '',
                observaciones: r.observaciones ?? '',
                numeroOficialAsignado: r.numeroOficialAsignado ?? '',
                derechos: r.derechos,
                forma: r.forma,
                importeTotal: r.importeTotal,
                createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : '',
                updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : '',
                createdById: r.createdById ?? '',
                updatedById: r.updatedById ?? '',
            });
        }

        const header = sheet.getRow(1);
        header.font = { bold: true } as any;
        header.alignment = { vertical: 'middle', horizontal: 'center' } as any;

        const buffer = await workbook.xlsx.writeBuffer();
        const filename = `numeros_oficiales_${inicio.toISOString().slice(0, 10)}_${fin.toISOString().slice(0, 10)}.xlsx`;
        return { buffer: Buffer.from(buffer), filename };
    }
}
