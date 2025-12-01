import type { StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';
import { DateFormatter } from 'src/common/helpers';
import { NumerosOficiale } from '../numeros-oficiales/entities/numeros-oficiale.entity';

interface NumerosOficialesListaReportValues {
    numerosOficiales: NumerosOficiale[];
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
        fontSize: 7,
        margin: [3, 3, 3, 3],
    },
    resumen: {
        fontSize: 9,
        bold: true,
        margin: [0, 10, 0, 10],
    },
};

export const getNumerosOficialesListaReport = (
    values: NumerosOficialesListaReportValues,
): TDocumentDefinitions => {
    const { numerosOficiales } = values;

    // Agrupar números oficiales por día
    const registrosPorDia = numerosOficiales.reduce((acc, n) => {
        const fecha = DateFormatter.getDDMMYYYY(new Date(n.createdAt));
        if (!acc[fecha]) {
            acc[fecha] = [];
        }
        acc[fecha].push(n);
        return acc;
    }, {} as Record<string, NumerosOficiale[]>);

    // Ordenar las fechas
    const fechasOrdenadas = Object.keys(registrosPorDia).sort((a, b) => {
        const [diaA, mesA, anioA] = a.split('/');
        const [diaB, mesB, anioB] = b.split('/');
        const fechaA = new Date(parseInt(anioA), parseInt(mesA) - 1, parseInt(diaA));
        const fechaB = new Date(parseInt(anioB), parseInt(mesB) - 1, parseInt(diaB));
        return fechaA.getTime() - fechaB.getTime();
    });

    // Tabla principal con encabezado
    const tableBody: any[] = [
        [
            { text: 'Num.Folio', style: 'tableHeader', fillColor: '#800000' },
            { text: 'Cta.Predial', style: 'tableHeader', fillColor: '#800000' },
            { text: 'Cve.Catastral', style: 'tableHeader', fillColor: '#800000' },
            { text: 'Domicilio', style: 'tableHeader', fillColor: '#800000' },
            { text: 'Num.Asignado', style: 'tableHeader', fillColor: '#800000' },
            { text: 'Nombre del Propietario', style: 'tableHeader', fillColor: '#800000' },
        ],
    ];

    // Agregar registros agrupados por día
    fechasOrdenadas.forEach((fecha, index) => {
        const registros = registrosPorDia[fecha];

        // Agregar separador de día
        if (index > 0) {
            tableBody.push([
                { text: '', colSpan: 6, border: [false, false, false, false], margin: [0, 3, 0, 3] },
                {},
                {},
                {},
                {},
                {},
            ]);
        }

        // Agregar encabezado del día
        tableBody.push([
            {
                text: `DÍA: ${fecha}`,
                colSpan: 6,
                bold: true,
                fontSize: 8,
                fillColor: '#e8e8e8',
                alignment: 'left',
                margin: [5, 3, 5, 3]
            },
            {},
            {},
            {},
            {},
            {},
        ]);

        // Agregar registros del día
        registros.forEach((n) => {
            tableBody.push([
                { text: n.numeroFolio ?? '', style: 'tableCell', alignment: 'center' },
                { text: n.CtaPredial ?? '', style: 'tableCell', alignment: 'center' },
                { text: n.claveCatastral ?? '', style: 'tableCell', alignment: 'center' },
                { text: (n.direccion || '').toUpperCase(), style: 'tableCell' },
                { text: n.numeroOficialAsignado ?? '', style: 'tableCell', alignment: 'center', bold: true },
                { text: (n.nombrePropietario || '').toUpperCase(), style: 'tableCell' },
            ]);
        });
    });

    const docDefinition: TDocumentDefinitions = {
        pageSize: 'LETTER',
        pageOrientation: 'portrait',
        styles: styles,
        pageMargins: [40, 60, 40, 60],
        header: {
            margin: [40, 20, 40, 0],
            columns: [
                {
                    image: 'src/common/assets/autlan-logo.png',
                    width: 45,
                    alignment: 'right',
                },
                {
                    width: '*',
                    alignment: 'center',
                    text: [
                        { text: 'H. AYUNTAMIENTO DE AUTLÁN DE NAVARRO\n', fontSize: 12, bold: true },
                        { text: 'REPORTE DE NÚMEROS OFICIALES', fontSize: 10 },
                    ],
                },
                { width: 80, alignment: 'right', text: DateFormatter.getDDMMYYYY(new Date()), fontSize: 9 },
            ],
        },
        content: [
            {
                text: `Lista de Números Oficiales Completa`,
                alignment: 'center',
            },
            {
                margin: [0, 10, 0, 10],
                table: {
                    widths: ['auto', 'auto', 'auto', '*', 'auto', '*'],
                    body: tableBody,
                },
            }
        ],
        footer: (currentPage: number, pageCount: number) => ({
            text: `Página ${currentPage} de ${pageCount}`,
            alignment: 'center',
            fontSize: 10,
            margin: [0, 20, 0, 0],
        }),
    };

    return docDefinition;
};