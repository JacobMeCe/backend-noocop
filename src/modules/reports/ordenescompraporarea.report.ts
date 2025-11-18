import type { StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';
import { DateFormatter } from 'src/common/helpers';

interface OrdenCompraData {
    id: string;
    serie_orden: string;
    folio_orden: string;
    proveedor_nombre: string;
    area_nombre: string;
    partida_nombre: string;
    aplicacion_destino: string;
    estado: string;
    subtotal: number;
    descuento: number;
    iva: number;
    total: number;
    creado_en: Date;
}

interface OrdenesCompraPorAreaReportValues {
    fechaInicio: Date;
    fechaFin: Date;
    area_id: string;
    area_nombre: string;
    totalOrdenes: number;
    ordenes: OrdenCompraData[];
}

const styles: StyleDictionary = {
    header: {
        fontSize: 16,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 5],
    },
    subheader: {
        fontSize: 12,
        bold: true,
        alignment: 'center',
        margin: [0, 5, 0, 10],
    },
    tableHeader: {
        bold: true,
        fontSize: 9,
        color: 'white',
        fillColor: '#2c3e50',
        alignment: 'center',
    },
    tableCell: {
        fontSize: 8,
        margin: [3, 3, 3, 3],
    },
    resumen: {
        fontSize: 10,
        bold: true,
        margin: [0, 10, 0, 10],
    },
};

const getEstadoColor = (estado: string): string => {
    switch (estado.toLowerCase()) {
        case 'activa':
            return '#27ae60';
        case 'en_proceso':
            return '#f39c12';
        case 'completada':
            return '#3498db';
        case 'cancelada':
            return '#e74c3c';
        case 'eliminada':
            return '#95a5a6';
        default:
            return '#34495e';
    }
};

const getEstadoTexto = (estado: string): string => {
    switch (estado.toLowerCase()) {
        case 'activa':
            return 'Activa';
        case 'en_proceso':
            return 'En Proceso';
        case 'completada':
            return 'Completada';
        case 'cancelada':
            return 'Cancelada';
        case 'eliminada':
            return 'Eliminada';
        default:
            return estado;
    }
};

export const getOrdenesCompraPorAreaReport = (
    values: OrdenesCompraPorAreaReportValues,
): TDocumentDefinitions => {
    const { fechaInicio, fechaFin, area_nombre, totalOrdenes, ordenes } = values;

    // Calcular totales
    const montoTotalGeneral = ordenes.reduce((sum, orden) => sum + orden.total, 0);
    const subtotalGeneral = ordenes.reduce((sum, orden) => sum + orden.subtotal, 0);
    const ivaGeneral = ordenes.reduce((sum, orden) => sum + orden.iva, 0);

    // Crear las filas de la tabla
    const tableBody = [
        // Encabezado
        [
            { text: 'Serie/Folio', style: 'tableHeader' },
            { text: 'Fecha', style: 'tableHeader' },
            { text: 'Proveedor', style: 'tableHeader' },
            { text: 'Partida', style: 'tableHeader' },
            { text: 'Estado', style: 'tableHeader' },
            { text: 'Subtotal', style: 'tableHeader' },
            { text: 'IVA', style: 'tableHeader' },
            { text: 'Total', style: 'tableHeader' },
        ],
        // Datos
        ...ordenes.map((orden) => [
            {
                text: `${orden.serie_orden}-${orden.folio_orden}`,
                style: 'tableCell',
                alignment: 'center',
                fontSize: 7
            },
            {
                text: DateFormatter.getDDMMYYYY(new Date(orden.creado_en)),
                style: 'tableCell',
                alignment: 'center',
                fontSize: 7
            },
            {
                text: orden.proveedor_nombre || 'N/A',
                style: 'tableCell',
                fontSize: 7
            },
            {
                text: orden.partida_nombre || 'N/A',
                style: 'tableCell',
                fontSize: 7
            },
            {
                text: getEstadoTexto(orden.estado),
                style: 'tableCell',
                alignment: 'center',
                color: 'white',
                fillColor: getEstadoColor(orden.estado),
                fontSize: 7
            },
            {
                text: `$${orden.subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                style: 'tableCell',
                alignment: 'right',
                fontSize: 7
            },
            {
                text: `$${orden.iva.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                style: 'tableCell',
                alignment: 'right',
                fontSize: 7
            },
            {
                text: `$${orden.total.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                style: 'tableCell',
                alignment: 'right',
                fontSize: 7,
                bold: true
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
                            text: 'REPORTE DE ÓRDENES DE COMPRA POR ÁREA',
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
                text: `ÓRDENES DE COMPRA - ÁREA: ${area_nombre}`,
                style: 'header',
                color: '#2c3e50',
            },
            {
                text: `Período: ${DateFormatter.getDDMMYYYY(fechaInicio)} al ${DateFormatter.getDDMMYYYY(fechaFin)}`,
                style: 'subheader',
            },
            // Resumen
            {
                style: 'resumen',
                margin: [0, 10, 0, 15],
                table: {
                    widths: ['*', '*', '*', '*'],
                    body: [
                        [
                            {
                                text: `Total Órdenes: ${totalOrdenes}`,
                                alignment: 'center',
                                fillColor: '#ecf0f1',
                                margin: [5, 6, 5, 6],
                                fontSize: 9
                            },
                            {
                                text: `Subtotal: $${subtotalGeneral.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                                alignment: 'center',
                                fillColor: '#ecf0f1',
                                margin: [5, 6, 5, 6],
                                fontSize: 9
                            },
                            {
                                text: `IVA: $${ivaGeneral.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                                alignment: 'center',
                                fillColor: '#ecf0f1',
                                margin: [5, 6, 5, 6],
                                fontSize: 9
                            },
                            {
                                text: `Total: $${montoTotalGeneral.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                                alignment: 'center',
                                fillColor: '#d5dbdb',
                                margin: [5, 6, 5, 6],
                                fontSize: 9,
                                bold: true
                            },
                        ],
                    ],
                },
                layout: 'noBorders',
            },
            // Tabla de órdenes
            {
                table: {
                    headerRows: 1,
                    widths: [55, 45, '*', 70, 45, 55, 45, 55],
                    body: tableBody,
                },
                layout: {
                    fillColor: function (rowIndex, node, columnIndex) {
                        // No aplicar fillColor a la columna de estado (índice 4)
                        if (columnIndex === 4 && rowIndex > 0) {
                            return null;
                        }
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
