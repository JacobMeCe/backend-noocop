import { Controller, Get, Param, Res, Query, HttpStatus } from '@nestjs/common';
import { OrdenesCompraReportService } from './ordenes-compra-report.service';
import { Response } from 'express';
import { Auth } from 'src/auth/decorators';

@Controller('ordenes-compra-report')
export class OrdenesCompraReportController {
  constructor(private readonly ordenesCompraReportService: OrdenesCompraReportService) { }

  //*Orden de compra PDF*/
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

  //*Proveedores usados en un rango de meses*/
  @Get('/proveedores-por-mes/reporte')
  //@Auth()
  async proveedoresPorMes(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @Res() response: Response,
  ) {
    try {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);

      // Ajustar la fecha fin al último segundo del día
      fin.setHours(23, 59, 59, 999);

      const pdfDoc = await this.ordenesCompraReportService.proveedoresUsadosEnMes(inicio, fin);

      response.setHeader('Content-Type', 'application/pdf');
      pdfDoc.info.Title = `Reporte de Proveedores - ${fechaInicio} al ${fechaFin}`;
      pdfDoc.pipe(response);
      pdfDoc.end();
    } catch (error) {
      response.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: error.message,
        error: 'Not Found'
      });
    }
  }

  //*Órdenes de compra por mes*/
  @Get('/ordenes-por-mes/reporte')
  //@Auth()
  async ordenesCompraPorMes(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @Res() response: Response,
  ) {
    try {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);

      // Ajustar la fecha fin al último segundo del día
      fin.setHours(23, 59, 59, 999);

      const pdfDoc = await this.ordenesCompraReportService.ordenesCompraPorMes(inicio, fin);

      response.setHeader('Content-Type', 'application/pdf');
      pdfDoc.info.Title = `Reporte de Órdenes de Compra - ${fechaInicio} al ${fechaFin}`;
      pdfDoc.pipe(response);
      pdfDoc.end();
    } catch (error) {
      response.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: error.message,
        error: 'Not Found'
      });
    }
  }

  //*Órdenes de compra por estado*/
  @Get('/ordenes-por-estado/reporte')
  //@Auth()
  async ordenesCompraPorEstado(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @Query('estado') estado: string,
    @Res() response: Response,
  ) {
    try {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);

      // Ajustar la fecha fin al último segundo del día
      fin.setHours(23, 59, 59, 999);

      const pdfDoc = await this.ordenesCompraReportService.ordenesCompraPorEstado(inicio, fin, estado);

      response.setHeader('Content-Type', 'application/pdf');
      pdfDoc.info.Title = `Reporte de Órdenes de Compra por Estado - ${estado}`;
      pdfDoc.pipe(response);
      pdfDoc.end();
    } catch (error) {
      response.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: error.message,
        error: 'Not Found'
      });
    }
  }

  //*Órdenes de compra por área*/
  @Get('/ordenes-por-area/reporte')
  //@Auth()
  async ordenesCompraPorArea(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @Query('area_id') area_id: string,
    @Res() response: Response,
  ) {
    try {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);

      // Ajustar la fecha fin al último segundo del día
      fin.setHours(23, 59, 59, 999);

      const pdfDoc = await this.ordenesCompraReportService.ordenesCompraPorArea(inicio, fin, area_id);

      response.setHeader('Content-Type', 'application/pdf');
      pdfDoc.info.Title = `Reporte de Órdenes de Compra por Área`;
      pdfDoc.pipe(response);
      pdfDoc.end();
    } catch (error) {
      response.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: error.message,
        error: 'Not Found'
      });
    }
  }
}
