import type { StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';
import { CurrencyFormater, DateFormatter } from 'src/common/helpers';
import { OrdenCompra } from '../ordenes-compra/entities';
import { Column } from 'typeorm';

interface ReportValues {
    title?: string;
    subtitle?: string;
    OrdenCompra: OrdenCompra;
}

const styles: StyleDictionary = {
    header: {
        fontSize: 22,
        bold: true,
        alignment: 'center',
        margin: [0, 60, 0, 20],
    },
    body: {
        alignment: 'justify',
        margin: [0, 0, 0, 20],
        fontSize: 12,
    },
    signature: {
        alignment: 'center',
        margin: [0, 60, 0, 0],
    },
    footer: {
        alignment: 'center',
    },
};

export const getOrdenCompraReport = (
    values: ReportValues,
): TDocumentDefinitions => {
    const { OrdenCompra } = values;
    const docDefinition: TDocumentDefinitions = {
        pageSize: 'LETTER',
        pageOrientation: 'portrait',
        styles: styles,
        pageMargins: [30, 20, 30, 30],
        content: [
            {
                columns: [
                    {
                        image: 'src/common/assets/autlan-logo.png',
                        width: 50,
                    },
                    {
                        width: '*',
                        alignment: 'center',
                        stack: [
                            { text: 'H. AYUNTAMIENTO CONSTITUCIONAL', fontSize: 12, bold: true },
                            { text: 'DE AUTLÁN DE NAVARRO, JALISCO.', fontSize: 10 },
                            { text: 'ORDEN DE COMPRA', fontSize: 10, margin: [0, 2, 0, 0] }
                        ]
                    },
                    {
                        width: 150,
                        table: {
                            widths: ['auto', '*'],
                            body: [
                                [
                                    { text: 'FOLIO', bold: true, fillColor: '#222', color: 'white', alignment: 'center' },
                                    { text: `C`, alignment: 'right' },
                                ]
                            ]
                        },
                    }
                ]
            },

            {
                margin: [0, 10, 0, 2],
                table: {
                    widths: ['auto', '*', 80, '*'],

                    body: [
                        [
                            { text: 'PROVEEDOR:', bold: true, fontSize: 8 },
                            { text: OrdenCompra?.proveedor?.nombre_proveedor, fontSize: 8 },
                            { border: [false, true, false, false], text: '', fontSize: 8 },
                            { border: [false, true, true, false], text: '', fontSize: 8 },
                        ],
                        [
                            { text: 'DIRECCIÓN:', bold: true, fontSize: 8 },
                            { text: OrdenCompra?.proveedor?.domicilio, fontSize: 8 },
                            { border: [false, false, false, false], text: '', fontSize: 8 },
                            { border: [false, false, true, false], text: '', fontSize: 8 },
                        ],
                        [
                            { text: 'CIUDAD:', bold: true, fontSize: 8 },
                            { text: OrdenCompra?.proveedor?.poblacion, fontSize: 8 },
                            { text: 'FECHA:', bold: true, fontSize: 8 },
                            { text: DateFormatter.getDDMMYYYY(OrdenCompra?.creado_en), fontSize: 8 }
                        ],
                    ],
                },
            },
            { text: 'SR. PROVEEDOR SOLICITAMOS A UD. (SURTIR) LOS SIGUIENTES BIENES AL PORTADOR DE LA PRESENTE ORDEN DE COMPRA, MISMA QUE SE DEBERÁ ANEXAR A LA FACTURA PARA EL COBRO.', fontSize: 6, margin: [0, 2, 0, 2] },
            {
                table: {
                    widths: [40, 40, 265, 80, 80],
                    body: [
                        [
                            { text: 'CANTIDAD', bold: true, alignment: 'center', fontSize: 8, color: 'white', fillColor: '#222' },
                            { text: 'UNIDAD', bold: true, alignment: 'center', fontSize: 8, color: 'white', fillColor: '#222' },
                            { text: 'DESCRIPCIÓN', bold: true, alignment: 'center', fontSize: 8, color: 'white', fillColor: '#222' },
                            { text: 'COSTO', bold: true, alignment: 'center', fontSize: 8, color: 'white', fillColor: '#222' },
                            { text: 'IMPORTE', bold: true, alignment: 'center', fontSize: 8, color: 'white', fillColor: '#222' }
                        ],
                        ...((OrdenCompra?.productos || []).map(p => [
                            { text: p.cantidad, alignment: 'center', fontSize: 9 },
                            { text: p.unidad, alignment: 'center', fontSize: 9 },
                            { text: p.descripcion, fontSize: 9 },
                            { text: CurrencyFormater.formatCurrency(Number(p.costo_sin_iva)), alignment: 'right', fontSize: 9 },
                            { text: CurrencyFormater.formatCurrency(Number(p.importe)), alignment: 'right', fontSize: 9 }
                        ])),
                        [
                            { text: '', colSpan: 5, border: [false, false, false, false], margin: [0, 30, 0, 30] }, '', '', '', ''
                        ]
                    ]
                },
                margin: [0, 0, 0, 10]
            },
            {
                columns: [
                    {
                        width: 200,
                        stack: [
                            { text: 'APLICACIÓN O DESTINO', fontSize: 8 },
                            { text: OrdenCompra?.aplicacion_destino || '_________________', fontSize: 8 },
                            { text: 'ÁREA O DEPTO. QUE SOLICITA', fontSize: 8 },
                            { text: OrdenCompra?.area?.nombre || '_________________', fontSize: 8 }
                        ]
                    },
                    {
                        width: 120,
                        table: {
                            widths: ['*'],
                            body: [
                                [{ text: 'SUB-TOTAL', fontSize: 8 }],
                                [{ text: CurrencyFormater.formatCurrency(Number(OrdenCompra?.subtotal || 0)), fontSize: 8 }],
                                [{ text: 'DESCUENTO', fontSize: 8 }],
                                [{ text: CurrencyFormater.formatCurrency(Number(OrdenCompra?.descuento || 0)), fontSize: 8 }],
                                [{ text: 'I.V.A.', fontSize: 8 }],
                                [{ text: CurrencyFormater.formatCurrency(Number(OrdenCompra?.iva || 0)), fontSize: 8 }],
                                [{ text: 'TOTAL', fontSize: 8, bold: true }],
                                [{ text: CurrencyFormater.formatCurrency(Number(OrdenCompra?.total || 0)), fontSize: 8, bold: true }]
                            ]
                        },
                        layout: 'noBorders'
                    }
                ]
            },
            { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 540, y2: 0, lineWidth: 1 }], margin: [0, 10, 0, 5] },
            {
                table: {
                    widths: [120, 120, 120, 120],
                    body: [
                        [
                            { text: 'SOLICITA', alignment: 'center', fontSize: 8 },
                            { text: 'AUTORIZA', alignment: 'center', fontSize: 8 },
                            { text: 'RECIBE', alignment: 'center', fontSize: 8 },
                            { text: '', border: [false, false, false, false] }
                        ],
                        [
                            { text: '_________________', fontSize: 8 },
                            { text: '_________________', fontSize: 8 },
                            { text: '_________________', fontSize: 8 },
                            { text: '', border: [false, false, false, false] }
                        ],
                        [
                            { text: '_________________', fontSize: 8 },
                            { text: 'JEFE DEPARTAMENTO', fontSize: 8 },
                            { text: 'TESORERÍA', fontSize: 8 },
                            { text: '', border: [false, false, false, false] }
                        ]
                    ]
                },
                layout: 'noBorders',
                margin: [0, 10, 0, 0]
            },
            { text: 'HAAG No. 11-C', fontSize: 7, margin: [0, 10, 0, 0] },
            {
                columns: [
                    { text: 'Proveedor: Original', fontSize: 7, alignment: 'left' },
                    { text: 'Copia: Tesorería', fontSize: 7, alignment: 'right' }
                ]
            }
        ]
    };

    return docDefinition;
};