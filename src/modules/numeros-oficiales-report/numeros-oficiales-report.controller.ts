import { Controller, Get, Param, Res } from '@nestjs/common';
import { NumerosOficialesReportService } from './numeros-oficiales-report.service';
import { Response } from 'express';

@Controller('numeros-oficiales-report')
export class NumerosOficialesReportController {
  constructor(private readonly numerosOficialesReportService: NumerosOficialesReportService) { }

  //*Orden de compra PDF*/
  @Get('/:numeroOficialeId')
  //@Auth()
  async ordenCompraId(
    @Res() response: Response,
    @Param('numeroOficialeId') numeroOficialeId: string,
  ) {
    const pdfDoc = await this.numerosOficialesReportService.printNumeroOficial(numeroOficialeId);
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.info.Title = `Reporte de Número Oficial`;
    pdfDoc.pipe(response);
    pdfDoc.end();
  }
}
