import type { StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';
import { DateFormatter } from 'src/common/helpers';
import { Proveedor } from '../proveedor/entities/proveedor.entity';

interface ReportValues {
    proveedor: Proveedor
}

interface ProveedorUsado {
    id: string;
    codigo_proveedor: string;
    nombre_proveedor: string;
    domicilio: string;
    telefono: string;
    totalOrdenes: number;
    montoTotal: number;
}

interface ProveedoresMesReportValues {
    fechaInicio: Date;
    fechaFin: Date;
    totalProveedores: number;
    totalOrdenes: number;
    proveedores: ProveedorUsado[];
}

const styles: StyleDictionary = {
    header: {
        fontSize: 22,
        bold: true,
        alignment: 'center',
        margin: [0, 60, 0, 20],
    },
    subheader: {
        fontSize: 16,
        bold: true,
        alignment: 'center',
        margin: [0, 10, 0, 15],
    },
    body: {
        alignment: 'justify',
        margin: [0, 0, 0, 20],
        fontSize: 12,
    },
    tableHeader: {
        bold: true,
        fontSize: 11,
        color: 'white',
        fillColor: '#2c3e50',
        alignment: 'center',
    },
    tableCell: {
        fontSize: 10,
        margin: [5, 5, 5, 5],
    },
    signature: {
        alignment: 'center',
        margin: [0, 60, 0, 0],
    },
    footer: {
        alignment: 'center',
    },
    resumen: {
        fontSize: 11,
        bold: true,
        margin: [0, 10, 0, 10],
    },
};


export const getProveedoresMesReport = (
    values: ProveedoresMesReportValues,
): TDocumentDefinitions => {
    const { fechaInicio, fechaFin, totalProveedores, totalOrdenes, proveedores } = values;

    // Calcular el total general de todas las órdenes
    const montoTotalGeneral = proveedores.reduce((sum, p) => sum + p.montoTotal, 0);

    // Crear las filas de la tabla
    const tableBody = [
        // Encabezado
        [
            { text: 'Código', style: 'tableHeader' },
            { text: 'Nombre del Proveedor', style: 'tableHeader' },
            { text: 'Teléfono', style: 'tableHeader' },
            { text: 'Órdenes', style: 'tableHeader' },
            { text: 'Monto Total', style: 'tableHeader' },
        ],
        // Datos
        ...proveedores.map((proveedor, index) => [
            { text: proveedor.codigo_proveedor, style: 'tableCell', alignment: 'center', fontSize: 9 },
            { text: proveedor.nombre_proveedor, style: 'tableCell', fontSize: 9 },
            { text: proveedor.telefono || 'N/A', style: 'tableCell', alignment: 'center', fontSize: 9 },
            { text: proveedor.totalOrdenes.toString(), style: 'tableCell', alignment: 'center', fontSize: 9 },
            {
                text: `$${proveedor.montoTotal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                style: 'tableCell',
                alignment: 'right',
                fontSize: 9
            },
        ]),
    ];

    const docDefinition: TDocumentDefinitions = {
        pageSize: 'LETTER',
        pageOrientation: 'portrait',
        styles: styles,
        pageMargins: [40, 100, 40, 60],
        header: {
            margin: [40, 20, 40, 0],
            columns: [
                {
                    image: 'src/common/assets/autlan-logo.png',
                    width: 50,
                },
                {
                    width: '*',
                    lineHeight: 1.2,
                    alignment: 'center',
                    text: [
                        {
                            text: 'H. AYUNTAMIENTO DE AUTLÁN DE NAVARRO\n',
                            fontSize: 12,
                            bold: true,
                        },
                        {
                            text: 'REPORTE DE PROVEEDORES UTILIZADOS',
                            fontSize: 10,
                        },
                    ],
                },
                {
                    width: 80,
                    alignment: 'right',
                    text: DateFormatter.getDDMMYYYY(new Date()),
                    fontSize: 9,
                },
            ],
        },
        content: [
            {
                text: 'PROVEEDORES UTILIZADOS EN ÓRDENES DE COMPRA',
                style: 'header',
                fontSize: 16,
                margin: [0, 0, 0, 5],
            },
            {
                text: `Período: ${DateFormatter.getDDMMYYYY(fechaInicio)} al ${DateFormatter.getDDMMYYYY(fechaFin)}`,
                style: 'subheader',
                fontSize: 12,
                margin: [0, 5, 0, 10],
            },
            // Resumen
            {
                style: 'resumen',
                margin: [0, 10, 0, 15],
                table: {
                    widths: ['*', '*', '*'],
                    body: [
                        [
                            { text: `Total de Proveedores: ${totalProveedores}`, alignment: 'center', fillColor: '#ecf0f1', margin: [5, 6, 5, 6], fontSize: 10 },
                            { text: `Total de Órdenes: ${totalOrdenes}`, alignment: 'center', fillColor: '#ecf0f1', margin: [5, 6, 5, 6], fontSize: 10 },
                            {
                                text: `Monto Total: $${montoTotalGeneral.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                                alignment: 'center',
                                fillColor: '#ecf0f1',
                                margin: [5, 6, 5, 6],
                                fontSize: 10
                            },
                        ],
                    ],
                },
                layout: 'noBorders',
            },
            // Tabla de proveedores
            {
                table: {
                    headerRows: 1,
                    widths: [60, '*', 70, 50, 75],
                    body: tableBody,
                },
                layout: {
                    fillColor: function (rowIndex) {
                        return rowIndex === 0 ? '#2c3e50' : rowIndex % 2 === 0 ? '#f9f9f9' : null;
                    },
                    hLineWidth: function (i, node) {
                        return i === 0 || i === 1 || i === node.table.body.length ? 1 : 0.5;
                    },
                    vLineWidth: function () {
                        return 0.5;
                    },
                    hLineColor: function () {
                        return '#cccccc';
                    },
                    vLineColor: function () {
                        return '#cccccc';
                    },
                },
            },
        ],
        footer: function (currentPage, pageCount) {
            return {
                text: `Página ${currentPage} de ${pageCount}`,
                alignment: 'center',
                fontSize: 10,
                margin: [0, 20, 0, 0],
            };
        },
    };

    return docDefinition;
};