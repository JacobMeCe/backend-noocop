import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { OrdenesCompraService } from './ordenes-compra.service';
import { CreateOrdenCompraDto } from './dto/create-orden-compra.dto';
import { UpdateOrdenCompraDto } from './dto/update-orden-compra.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { EstadoOrdenCompra } from './entities/ordenes-compra.entity';
import { Auth } from 'src/auth/decorators';

@Controller('ordenes-compra')
export class OrdenesCompraController {
  constructor(private readonly ordenesCompraService: OrdenesCompraService) { }

  @Post()
  //@Auth()
  create(@Body() createOrdenCompraDto: CreateOrdenCompraDto) {
    return this.ordenesCompraService.create(createOrdenCompraDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto, @Query('estado') estado?: EstadoOrdenCompra) {
    return this.ordenesCompraService.findAll(paginationDto, estado);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordenesCompraService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateOrdenCompraDto: UpdateOrdenCompraDto) {
    return this.ordenesCompraService.update(id, updateOrdenCompraDto);
  }

  @Patch(':id/cambiar-estado')
  cambiarEstado(@Param('id', ParseUUIDPipe) id: string, @Body('estado') estado: EstadoOrdenCompra) {
    return this.ordenesCompraService.cambiarEstado(id, estado);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordenesCompraService.remove(id);
  }
}
