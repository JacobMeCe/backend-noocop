import { Controller, Get, Param, Res, Query, BadRequestException } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { NumerosOficialesReportService } from './numeros-oficiales-report.service';
import { Response } from 'express';

@Controller('numeros-oficiales-report')
export class NumerosOficialesReportController {
  constructor(private readonly numerosOficialesReportService: NumerosOficialesReportService) { }

  // Reporte por fechas (debe ir ANTES de la ruta dinámica para evitar conflicto)
  @Get('/porfechas')
  async numerosOficialesPorMes(
    @Res() response: Response,
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    if (!fechaInicio || !fechaFin) {
      throw new BadRequestException('Debe proporcionar fechaInicio y fechaFin');
    }
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
      throw new BadRequestException('Formato de fecha inválido');
    }
    const pdfDoc = await this.numerosOficialesReportService.printNumerosOficialesPorMes(inicio, fin);
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.info.Title = `Reporte de Números Oficiales (${fechaInicio} - ${fechaFin})`;
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  // Reporte de todos sin filtros de fechas
  @Get('/todos')
  async numerosOficialesTodos(@Res() response: Response) {
    const pdfDoc = await this.numerosOficialesReportService.printNumerosOficialesTodos();
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.info.Title = `Reporte de Números Oficiales (Todos)`;
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  // Exportar por fechas a Excel
  @Get('/porfechas/excel')
  async exportPorFechasExcel(
    @Res() response: Response,
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    if (!fechaInicio || !fechaFin) {
      throw new BadRequestException('Debe proporcionar fechaInicio y fechaFin');
    }
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
      throw new BadRequestException('Formato de fecha inválido');
    }
    const { buffer, filename } = await this.numerosOficialesReportService.exportByDatesToExcel(inicio, fin);
    response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    response.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    response.send(buffer);
  }

  // Reporte individual por ID (UUID)
  @Get('/:numeroOficialeId')
  async ordenCompraId(
    @Res() response: Response,
    @Param('numeroOficialeId') numeroOficialeId: string,
  ) {
    if (!isUUID(numeroOficialeId)) {
      throw new BadRequestException('El parámetro numeroOficialeId debe ser un UUID válido');
    }
    const pdfDoc = await this.numerosOficialesReportService.printNumeroOficial(numeroOficialeId);
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.info.Title = `Reporte de Número Oficial`;
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  // Exportar toda la tabla a Excel
  @Get('/export/excel')
  async exportExcel(@Res() response: Response) {
    const { buffer, filename } = await this.numerosOficialesReportService.exportAllToExcel();
    response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    response.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    response.send(buffer);
  }

}
