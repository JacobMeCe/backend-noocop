import type { StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';
import { CurrencyFormater, DateFormatter } from 'src/common/helpers';
import { NumerosOficiale } from '../numeros-oficiales/entities/numeros-oficiale.entity';

interface ReportValues {
    title?: string;
    subtitle?: string;
    numeroOficiale: NumerosOficiale;
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

export const getNumerosOficialesReport = (
    values: ReportValues,
): TDocumentDefinitions => {
    const { numeroOficiale } = values;

    const docDefinition: TDocumentDefinitions = {
        pageSize: 'LETTER',
        pageOrientation: 'portrait',
        styles: styles,
        pageMargins: [30, 20, 30, 30],
        content: [
            {
                columns: [
                    {
                        image: 'src/common/assets/banderaAutlan.png',
                        width: 100,
                        alignment: 'right',
                    },
                    {
                        stack: [
                            {
                                text: 'H. AYUNTAMIENTO CONSTITUCIONAL DE AUTLÁN',
                                fontSize: 16,
                                bold: true,
                                margin: [0, 0, 0, 2],
                            },
                            {
                                text: 'JEFATURA DE CATASTRO MUNICIPAL',
                                fontSize: 13,
                                bold: true,
                                margin: [0, 0, 0, 1],
                            },
                            {
                                text: 'ÁREA DE NOMENCLATURA',
                                fontSize: 12,
                                bold: true,
                                margin: [0, 0, 0, 1],
                            },
                            {
                                text: 'ASIGNACIÓN DE NÚMERO OFICIAL',
                                fontSize: 11,
                                bold: true,
                            },
                        ],
                        alignment: 'center',
                    },
                    {
                        image: 'src/common/assets/autlan-logo.png',
                        width: 75,
                        alignment: 'right',
                    },

                ],
            },
            {
                columns: [
                    {
                        text: `Fecha de Trámite: ${DateFormatter.getDDMMYYYY(numeroOficiale.createdAt)}`,
                        alignment: 'left',
                    },
                    {
                        text: `Núm.de Folio: ${numeroOficiale.numeroFolio}`,
                        alignment: 'right',
                    }
                ],
                margin: [0, 10, 0, 0],
            },
            //Ubicación del predio
            {
                fontSize: 10,
                margin: [0, 10, 0, 0],
                table: {
                    widths: [80, 110, '*', 'auto'],
                    body: [
                        [
                            {
                                text: `UBICACIÓN DEL PREDIO`,
                                colSpan: 4,
                                color: 'white',
                                bold: true,
                                fillColor: '#800000',
                            },
                            {
                                text: ''
                            },
                            {
                                text: ''
                            },
                            {
                                text: ''
                            },
                        ],
                        [
                            {
                                text: 'CTA. PREDIAL',
                                bold: true,
                            },
                            {
                                text: 'CLAVE CATASTRAL',
                                bold: true,
                            },
                            {
                                text: 'CALLE Y NÚMERO',
                                bold: true,
                            },
                            {
                                text: 'FRACCIONAMIENTO / COLONIA',
                                bold: true,
                            },
                        ],
                        [
                            {
                                text: numeroOficiale.CtaPredial,
                            },
                            {
                                text: numeroOficiale.claveCatastral,
                            },
                            {
                                text: numeroOficiale.direccion,
                            },
                            {
                                text: numeroOficiale.colonia,
                            },
                        ],
                    ],
                },
            },
            //Destino del predio
            {
                fontSize: 10,
                margin: [0, 10, 0, 0],
                table: {
                    widths: ['auto', '*'],
                    body: [
                        [
                            {
                                text: `DESTINO DEL PREDIO`,
                                colSpan: 2,
                                color: 'white',
                                bold: true,
                                fillColor: '#800000',
                            },
                            {
                                text: ''
                            },
                        ],
                        [
                            {
                                text: 'USO DE SUELO',
                                bold: true,
                            },
                            {
                                text:
                                    `${(numeroOficiale.usoSuelo ?? '').toUpperCase()}` +
                                    `${(numeroOficiale.usoSuelo ?? '').toUpperCase() === 'OTROS' && numeroOficiale.otro ? ' - ' + numeroOficiale.otro : ''}`,
                            },
                        ],
                    ],
                },
            },
            //Datos del propietario
            {
                fontSize: 10,
                margin: [0, 10, 0, 0],
                table: {
                    widths: ['auto', '*', 'auto', '*'],
                    body: [
                        [
                            {
                                text: `DATOS SOBRE EL PROPIETARIO DEL PREDIO`,
                                colSpan: 4,
                                color: 'white',
                                bold: true,
                                fillColor: '#800000',
                            },
                            {
                                text: ''
                            },
                            {
                                text: ''
                            },
                            {
                                text: ''
                            },
                        ],
                        [
                            {
                                text: 'NOMBRE Y APELLIDOS Ó RAZÓN SOCIAL',
                                bold: true,
                            },
                            {
                                text: `${(numeroOficiale.nombrePropietario ?? '').toUpperCase()}`,
                                colSpan: 3,
                            },
                            {
                                text: ''
                            },
                            {
                                text: ''
                            },
                        ],
                        [
                            {
                                text: 'DOMICILIO',
                                bold: true,
                            },
                            {
                                text: `${(numeroOficiale.domicilioPropietario ?? '').toUpperCase()}`,
                            },
                            {
                                text: 'TELEFONO',
                                bold: true,
                            },
                            {
                                text: `${numeroOficiale.telefonoPropietario ?? ''}`,
                            },
                        ],
                    ],
                },
            },
            //Asignación de número oficial
            {
                columns: [
                    {
                        fontSize: 10,
                        margin: [0, 10, 10, 0],
                        table: {
                            widths: ['auto', '*'],
                            heights: [undefined, 40],
                            body: [
                                [
                                    {
                                        text: `ASIGNACIÓN DE NÚMERO OFICIAL`,
                                        colSpan: 2,
                                        color: 'white',
                                        bold: true,
                                        fillColor: '#800000',
                                    },
                                    {
                                        text: ''
                                    },
                                ],
                                [
                                    {
                                        text: 'NÚMERO OFICIAL ASIGNADO',
                                        bold: true,
                                        alignment: 'right',
                                        margin: [0, 12, 0, 0],
                                    },
                                    {
                                        text: `${numeroOficiale.numeroOficialAsignado ?? ''}`,
                                        margin: [0, 12, 0, 0],
                                        alignment: 'center',
                                        fontSize: 16,
                                        bold: true,
                                    },
                                ],
                            ],
                        },
                    },
                    {
                        fontSize: 10,
                        margin: [0, 10, 0, 0],

                        table: {
                            widths: ['auto', 40, '*'],
                            body: [
                                [
                                    {
                                        text: `COSTOS DEL TRÁMITE`,
                                        colSpan: 3,
                                        color: 'white',
                                        bold: true,
                                        fillColor: '#800000',
                                    },
                                    {
                                        text: ''
                                    },
                                    {
                                        text: ''
                                    },
                                ],
                                [
                                    {
                                        text: 'DERECHOS',
                                        alignment: 'right',
                                        fontSize: 8,
                                    },
                                    {
                                        text: `$${numeroOficiale.derechos ?? ''}`,
                                        fontSize: 8,
                                    },
                                    {
                                        text: 'PAGADO BAJO RECIBO OFICIAL NÚMERO',
                                        fontSize: 7,
                                        rowSpan: 3,
                                        alignment: 'center'
                                    },
                                ],
                                [
                                    {
                                        text: 'FORMA',
                                        alignment: 'right',
                                        fontSize: 8,
                                    },
                                    {
                                        text: `$${numeroOficiale.forma ?? ''}`,
                                        fontSize: 8,
                                    },
                                    {
                                        text: ''
                                    },
                                ],
                                [
                                    {
                                        text: 'IMPORTE TOTAL',
                                        fontSize: 8,
                                        alignment: 'right',
                                    },
                                    {
                                        text: `$${numeroOficiale.importeTotal ?? ''}`,
                                        fontSize: 8,
                                    },
                                    {
                                        text: ''
                                    },
                                ],
                            ],
                        },
                    },
                ],

            },
            {
                fontSize: 10,
                margin: [0, 10, 0, 0],
                table: {
                    widths: ['*'],
                    body: [
                        [
                            {
                                text: 'OBSERVACIONES',
                                color: 'white',
                                bold: true,
                                fillColor: '#800000',
                            },
                        ],
                        [
                            {
                                text: `${numeroOficiale.observaciones ?? ''}`,
                            },
                        ],
                    ],
                },
            },
            {
                margin: [20, 5, 20, 0],
                columns: [
                    {
                        text: `LUGAR PARA DIBUJAR EL CROQUIS`,
                        alignment: 'left',
                        fontSize: 10,
                    },
                    {
                        text: `SELLO DE CAJA`,
                        alignment: 'right',
                        fontSize: 10,

                    }
                ],
            },
            {
                fontSize: 10,
                margin: [0, 5, 0, 0],
                table: {
                    widths: ['*'],
                    heights: [260],
                    body: [
                        [
                            {
                                text: '',
                            },
                        ],
                    ],
                },
            },
            {
                margin: [20, 15, 20, 0],
                columns: [
                    {
                        text: `RECIBI DE CONFORMIDAD \n\n\n __________________________`,
                        alignment: 'center',
                        fontSize: 10,
                    },
                    {
                        text: `SELLO Y FIRMA DEL\n  REVISOR DE LICENCIAS \n\n __________________________`,
                        alignment: 'center',
                        fontSize: 10,

                    }
                ],
            },
        ]
    };

    return docDefinition;
};