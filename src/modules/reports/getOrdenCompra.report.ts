import type { StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';
import { CurrencyFormater, DateFormatter } from 'src/common/helpers';
import { OrdenCompra } from '../ordenes-compra/entities';
import { Column } from 'typeorm';
import { text } from 'stream/consumers';

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

    // Función para calcular cuenta, subcuenta y subsubcuenta desde la partida
    const getPartidaInfo = (partida: string) => {
        if (!partida) return { cuenta: '', subcuenta: '', subsubcuenta: '' };

        const firstDigit = partida.charAt(0);
        const firstTwoDigits = partida.substring(0, 2);

        return {
            cuenta: `${firstDigit}000`,
            subcuenta: `${firstTwoDigits}00`,
            subsubcuenta: partida
        };
    };

    const partidaInfo = getPartidaInfo(OrdenCompra?.partida?.numero_partida || '');

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
                                    {
                                        text: [
                                            { text: `No. ${OrdenCompra?.folio_orden}`, fontSize: 12, bold: true, alignment: 'center', color: 'red' },
                                            { text: '     C', alignment: 'right' }
                                        ]
                                    },
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
                            { text: OrdenCompra?.folio_orden, fontSize: 6, alignment: 'center', colSpan: 2, border: [false, true, true, false] },
                            { border: [false, true, true, false], text: '', fontSize: 8 },
                        ],
                        [
                            { text: 'DIRECCIÓN:', bold: true, fontSize: 8 },
                            { text: OrdenCompra?.proveedor?.domicilio, fontSize: 8 },
                            {
                                border: [false, false, true, true],
                                colSpan: 2,
                                table: {
                                    widths: ['*', '*', '*'],
                                    body: [
                                        [
                                            { text: 'CUENTA', fontSize: 6, alignment: 'center' },
                                            { text: 'SUBCUENTA', fontSize: 6, alignment: 'center' },
                                            { text: 'SUBSUBCUENTA', fontSize: 6, alignment: 'center' }
                                        ],
                                        [
                                            { text: partidaInfo.cuenta, fontSize: 6, alignment: 'center' },
                                            { text: partidaInfo.subcuenta, fontSize: 6, alignment: 'center' },
                                            { text: partidaInfo.subsubcuenta, fontSize: 6, alignment: 'center' }
                                        ]
                                    ]
                                },
                                layout: 'noBorders'
                            },
                            { text: '', fontSize: 8 },
                        ],
                        [
                            { text: 'CIUDAD:', bold: true, fontSize: 8 },
                            { text: OrdenCompra?.proveedor?.poblacion, fontSize: 8 },
                            { text: 'FECHA:', bold: true, fontSize: 8 },
                            { text: DateFormatter.getDDMMMMYYYY(OrdenCompra?.creado_en), fontSize: 8 }
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
                            { text: 'CANTIDAD', bold: true, alignment: 'center', fontSize: 6, color: 'white', fillColor: '#222' },
                            { text: 'UNIDAD', bold: true, alignment: 'center', fontSize: 6, color: 'white', fillColor: '#222' },
                            { text: 'DESCRIPCIÓN', bold: true, alignment: 'center', fontSize: 6, color: 'white', fillColor: '#222' },
                            { text: 'COSTO', bold: true, alignment: 'center', fontSize: 6, color: 'white', fillColor: '#222' },
                            { text: 'IMPORTE', bold: true, alignment: 'center', fontSize: 6, color: 'white', fillColor: '#222' }
                        ],
                        ...((OrdenCompra?.productos || []).map(p => [
                            { text: p.cantidad, alignment: 'center', fontSize: 6 },
                            { text: p.unidad, alignment: 'center', fontSize: 6 },
                            { text: p.descripcion, fontSize: 6 },
                            { text: CurrencyFormater.formatCurrency(Number(p.costo_sin_iva)), alignment: 'right', fontSize: 6 },
                            { text: CurrencyFormater.formatCurrency(Number(p.importe)), alignment: 'right', fontSize: 6 }
                        ])),
                        [
                            { text: `DIAS DE \nCRÉDITO `, bold: true, alignment: 'left', fontSize: 8, colSpan: 2, },
                            { text: '' },
                            { text: '' },
                            { text: '' },
                            { text: '' },
                        ],
                    ]
                },
                margin: [0, 0, 0, 5]
            },
            {
                columns: [
                    {
                        width: 370,
                        table: {
                            widths: ['*', 110],
                            body: [
                                [{ text: `ÀREA O DEPTO. QUE SOLICITA ${OrdenCompra?.area?.nombre.toLocaleUpperCase()}`, fontSize: 8 }, {}],
                                [{}, {}],
                                [{ text: `APLICACIÓN O DESTINO ${OrdenCompra?.aplicacion_destino.toLocaleUpperCase()}`, fontSize: 8 }, {}],
                                [{}, {}],
                                [{}, {}],
                                [{ text: `ELABORÓ ${OrdenCompra?.area?.nombre.toLocaleUpperCase()}`, fontSize: 8 }, { text: 'No. VEHICULO', fontSize: 8 }],
                                [{}, {}],
                            ]
                        },
                        layout: {
                            hLineWidth: function (i, node) {
                                return (i === 0 || i === node.table.body.length) ? 1 : 0;
                            },
                            vLineWidth: function (i, node) {
                                return (i === 0 || i === node.table.widths.length) ? 1 : 0;
                            }
                        }
                    },
                    {
                        margin: [10, 0, 0, 0],
                        width: 180,
                        table: {
                            widths: [70, '*'],
                            body: [
                                [{ text: 'SUB-TOTAL', fontSize: 8, alignment: 'right' }, { text: CurrencyFormater.formatCurrency(Number(OrdenCompra?.subtotal || 0)), fontSize: 8, alignment: 'right' }],
                                [{ text: 'DESCUENTO', fontSize: 8, alignment: 'right' }, { text: CurrencyFormater.formatCurrency(Number(OrdenCompra?.descuento || 0)), fontSize: 8, alignment: 'right' }],
                                [{ text: 'I.V.A.', fontSize: 8, alignment: 'right' }, { text: CurrencyFormater.formatCurrency(Number(OrdenCompra?.iva)), fontSize: 8, alignment: 'right' }],
                                [{ text: 'TOTAL', fontSize: 8, bold: true, alignment: 'right' }, { text: CurrencyFormater.formatCurrency(Number(OrdenCompra?.total || 0)), fontSize: 8, bold: true, alignment: 'right' }],
                            ]
                        },
                        layout: {
                            hLineWidth: function (i, node) {
                                return (i === 0 || i === node.table.body.length) ? 1 : 0;
                            },
                            vLineWidth: function () {
                                return 1;
                            }
                        }
                    }
                ]
            },
            {
                margin: [0, 5, 0, 0],
                table: {
                    widths: ['*', '*', '*'],
                    body: [
                        [
                            { text: 'SOLICITA', alignment: 'center', fontSize: 6 },
                            { text: 'AUTORIZA', alignment: 'center', fontSize: 6 },
                            { text: 'RECIBE', alignment: 'center', fontSize: 6 },
                        ],
                        [{}, {}, {}],
                        [{}, {}, {}],
                        [
                            { text: `NOMBRE ${OrdenCompra.area.encargado}`, fontSize: 6 },
                            {
                                columns: [
                                    { text: '___________________', fontSize: 6, width: '*', alignment: 'center' },
                                    { text: '___________________', fontSize: 6, width: '*', alignment: 'center' }
                                ]
                            },
                            { text: `NOMBRE`, fontSize: 6 },
                        ],
                        [
                            { text: `PUESTO ${OrdenCompra.area.puesto}`, fontSize: 6 },
                            {
                                columns: [
                                    { text: 'JEFE DEPARTAMENTO', fontSize: 6, width: '*', alignment: 'center' },
                                    { text: 'TESORERÍA', fontSize: 6, width: '*', alignment: 'center' }
                                ]
                            },
                            { text: 'PUESTO', fontSize: 6 }
                        ],
                    ],


                }, layout: {
                    hLineWidth: function (i, node) {
                        return (i === 0 || i === node.table.body.length) ? 1 : 0;
                    },
                    vLineWidth: function () {
                        return 1;
                    }
                }
            },
            {
                table: {
                    widths: ['*', '*', '*'],
                    body: [
                        [
                            { text: 'HAAG No. 11-C', fontSize: 6 },
                            { text: 'Provedor: Original', fontSize: 6 },
                            { text: 'Copia: Tesorería', fontSize: 6 },
                        ],
                    ]
                },
                layout: 'noBorders'
            },
        ]
    };

    return docDefinition;
};