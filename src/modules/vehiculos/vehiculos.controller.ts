import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { VehiculosService } from './vehiculos.service';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { CreateServicioVehiculoDto } from './dto/create-servicio-vehiculo.dto';
import { UpdateServicioVehiculoDto } from './dto/update-servicio-vehiculo.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth } from 'src/auth/decorators';

@Controller('vehiculos')
export class VehiculosController {
  constructor(private readonly vehiculosService: VehiculosService) {}

  // ─── Vehículos ───────────────────────────────────────────────────────────────

  @Post()
  create(@Body() createVehiculoDto: CreateVehiculoDto) {
    return this.vehiculosService.create(createVehiculoDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.vehiculosService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.vehiculosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateVehiculoDto: UpdateVehiculoDto,
  ) {
    return this.vehiculosService.update(id, updateVehiculoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.vehiculosService.remove(id);
  }

  // ─── Servicios ───────────────────────────────────────────────────────────────

  @Post(':vehiculoId/servicios')
  createServicio(
    @Param('vehiculoId', ParseUUIDPipe) vehiculoId: string,
    @Body() createServicioDto: CreateServicioVehiculoDto,
  ) {
    return this.vehiculosService.createServicio(vehiculoId, createServicioDto);
  }

  @Get(':vehiculoId/servicios')
  findAllServicios(
    @Param('vehiculoId', ParseUUIDPipe) vehiculoId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.vehiculosService.findAllServicios(vehiculoId, paginationDto);
  }

  @Get('servicio/:servicioId')
  findOneServicio(@Param('servicioId', ParseUUIDPipe) servicioId: string) {
    return this.vehiculosService.findOneServicio(servicioId);
  }

  @Patch('servicio/:servicioId')
  @ApiOperation({ summary: 'Actualizar un servicio' })
  updateServicio(
    @Param('servicioId', ParseUUIDPipe) servicioId: string,
    @Body() updateServicioDto: UpdateServicioVehiculoDto,
  ) {
    return this.vehiculosService.updateServicio(servicioId, updateServicioDto);
  }

  @Delete('servicio/:servicioId')
  @ApiOperation({ summary: 'Eliminar un servicio' })
  removeServicio(@Param('servicioId', ParseUUIDPipe) servicioId: string) {
    return this.vehiculosService.removeServicio(servicioId);
  }
}

