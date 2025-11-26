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

            { text: numeroOficiale.claveCatastral }

        ]
    };

    return docDefinition;
};