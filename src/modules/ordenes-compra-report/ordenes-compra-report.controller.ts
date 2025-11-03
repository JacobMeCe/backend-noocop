import { Controller, Get, Param, Res } from '@nestjs/common';
import { OrdenesCompraReportService } from './ordenes-compra-report.service';
import { Response } from 'express';
import { Auth } from 'src/auth/decorators';

@Controller('ordenes-compra-report')
export class OrdenesCompraReportController {
  constructor(private readonly ordenesCompraReportService: OrdenesCompraReportService) { }

  @Get('/:ordenCompraId')
  //@Auth()
  async ordenCompraId(
    @Res() response: Response,
    @Param('ordenCompraId') ordenCompraId: string,
  ) {
    const pdfDoc = await this.ordenesCompraReportService.ordenCompra(ordenCompraId);
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.info.Title = `Reporte de Orden de Compra`;
    pdfDoc.pipe(response);
    pdfDoc.end();
  }
}
