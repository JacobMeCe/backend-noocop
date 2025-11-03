import type { StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';
import { CurrencyFormater, DateFormatter } from 'src/common/helpers';
import { OrdenCompra } from '../ordenes-compra/entities';

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
        pageSize: {
            width: 27.94 * 28.3465, // Ancho de carta en horizontal (27.94 cm)
            height: 21.59 * 28.3465, // Alto de carta en horizontal (21.59 cm)
        },
        pageOrientation: 'portrait',
        styles: styles,
        // background: {

        //     ///home/jacob/workspace/Backend/Backend-Presidencia/backend-noocop/src/common/assets/H. AYUNTAMIENTO CONSTITUCIONAL_pages-to-jpg-0001.jpg
        //     image: 'src/common/assets/fondo.jpg', // Ruta de tu imagen de fondo
        //     width: 21.40 * 28.3465,
        //     height: 17.50 * 28.3465,
        //     absolutePosition: { x: 0, y: 0 }
        // },
        pageMargins: [0, 0, 0, 0],
        content: [
            // Nombre del proveedor (3cm, 3cm)
            {
                text: OrdenCompra.proveedor.nombre_proveedor,
                absolutePosition: {
                    x: 3 * 28.3465,
                    y: 3 * 28.3465
                },
                fontSize: 10,
            },
            // Dirección proveedor (2.5cm, 3.60cm)
            {
                text: OrdenCompra.proveedor.domicilio || '',
                absolutePosition: {
                    x: 2.5 * 28.3465,
                    y: 3.60 * 28.3465
                },
                fontSize: 10,
            },
            // Ciudad proveedor (2cm, 4.20cm)
            {
                text: OrdenCompra.proveedor.poblacion || '',
                absolutePosition: {
                    x: 2 * 28.3465,
                    y: 4.20 * 28.3465
                },
                fontSize: 10,
            },
            // Fecha (14.50cm, 4.20cm)
            {
                text: DateFormatter.getDDMMYYYY(new Date(OrdenCompra.creado_en)),
                absolutePosition: {
                    x: 14.50 * 28.3465,
                    y: 4.20 * 28.3465
                },
                fontSize: 10,
            },
            // Nombre área (5.50cm, 13cm)
            {
                text: OrdenCompra.area.nombre || '',
                absolutePosition: {
                    x: 5.50 * 28.3465,
                    y: 13 * 28.3465
                },
                fontSize: 10,
            },
            // Aplicación o destino (4.24cm, 13.50cm)
            {
                text: OrdenCompra.aplicacion_destino || '',
                absolutePosition: {
                    x: 5 * 28.3465,
                    y: 13.50 * 28.3465
                },
                fontSize: 10,
            },
            // Elaboró (2.50cm, 14.50cm)
            {
                text: OrdenCompra.area.encargado || '',
                absolutePosition: {
                    x: 2.50 * 28.3465,
                    y: 14.50 * 28.3465
                },
                fontSize: 10,
            },
            // Solicita (2cm, 15.30cm)
            {
                text: OrdenCompra.area.encargado || '',
                absolutePosition: {
                    x: 2 * 28.3465,
                    y: 15 * 28.3465
                },
                fontSize: 10,
            },
            // Puesto (2cm, 15.60cm)
            {
                text: OrdenCompra.area.puesto || '',
                absolutePosition: {
                    x: 2 * 28.3465,
                    y: 15.60 * 28.3465
                },
                fontSize: 10,
            },
            // Tabla de productos (0.90cm, 5.50cm con margen)
            {
                absolutePosition: {
                    x: 0.90 * 28.3465,
                    y: 5.50 * 28.3465 // Agregado margen para centrar
                },
                table: {
                    headerRows: 1,
                    widths: [
                        2.30 * 28.3465,  // Cantidad
                        1.60 * 28.3465,  // Unidad
                        9.00 * 28.3465, // Descripción
                        2.20 * 28.3465,  // Costo
                        2.80 * 28.3465   // Total
                    ],
                    body: [
                        // Encabezados
                        [
                            { text: '', style: 'tableHeader', alignment: 'center', fontSize: 8 },
                            { text: '', style: 'tableHeader', alignment: 'center', fontSize: 8 },
                            { text: '', style: 'tableHeader', alignment: 'center', fontSize: 8 },
                            { text: '', style: 'tableHeader', alignment: 'center', fontSize: 8 },
                            { text: '', style: 'tableHeader', alignment: 'center', fontSize: 8 }
                        ],
                        // Productos
                        ...OrdenCompra.productos.map(producto => [
                            { text: producto.cantidad || '', alignment: 'center', fontSize: 8 },
                            { text: producto.unidad || '', alignment: 'center', fontSize: 8 },
                            { text: producto.descripcion || '', alignment: 'left', fontSize: 8 },
                            { text: CurrencyFormater.formatCurrency(producto.costo_sin_iva || 0), alignment: 'right', fontSize: 8 },
                            { text: CurrencyFormater.formatCurrency(producto.total_producto || 0), alignment: 'right', fontSize: 8 }
                        ])
                    ]
                },
                layout: 'noBorders'
            },
            // Subtotal (17.50cm, 13cm)
            {
                text: CurrencyFormater.formatCurrency(OrdenCompra.subtotal || 0),
                absolutePosition: {
                    x: 17.50 * 28.3465,
                    y: 13 * 28.3465
                },
                fontSize: 10,
            },
            // Descuento (17.50cm, 13.50cm)
            {
                text: CurrencyFormater.formatCurrency(OrdenCompra.descuento || 0),
                absolutePosition: {
                    x: 17.50 * 28.3465,
                    y: 13.50 * 28.3465
                },
                fontSize: 10,
            },
            // IVA (17.50cm, 14cm)
            {
                text: CurrencyFormater.formatCurrency(OrdenCompra.iva || 0),
                absolutePosition: {
                    x: 17.50 * 28.3465,
                    y: 14 * 28.3465
                },
                fontSize: 10,
            },
            // Total (17.50cm, 14.50cm)
            {
                text: CurrencyFormater.formatCurrency(OrdenCompra.total || 0),
                absolutePosition: {
                    x: 17.50 * 28.3465,
                    y: 14.50 * 28.3465
                },
                fontSize: 10,
            },
        ],
    };

    return docDefinition;
};