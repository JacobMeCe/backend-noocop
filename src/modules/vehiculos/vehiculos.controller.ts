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
import { CreateGasolinaVehiculoDto } from './dto/create-gasolina-vehiculo.dto';
import { UpdateGasolinaVehiculoDto } from './dto/update-gasolina-vehiculo.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/users/entities/user.entity';

@Controller('vehiculos')
export class VehiculosController {
  constructor(private readonly vehiculosService: VehiculosService) {}

  // ─── Vehículos ───────────────────────────────────────────────────────────────

  @Post()
  @Auth()
  create(@Body() createVehiculoDto: CreateVehiculoDto, @GetUser() user: User) {
    return this.vehiculosService.create(createVehiculoDto, user);
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
  @Auth()
  createServicio(
    @Param('vehiculoId', ParseUUIDPipe) vehiculoId: string,
    @Body() createServicioDto: CreateServicioVehiculoDto,
    @GetUser() user: User,
  ) {
    return this.vehiculosService.createServicio(
      vehiculoId,
      createServicioDto,
      user,
    );
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

  // ─── Gasolina ───────────────────────────────────────────────────────────────

  @Post(':vehiculoId/gasolinas')
  @Auth()
  @ApiOperation({ summary: 'Registrar carga de combustible para un vehículo' })
  createGasolina(
    @Param('vehiculoId', ParseUUIDPipe) vehiculoId: string,
    @Body() createGasolinaDto: CreateGasolinaVehiculoDto,
    @GetUser() user: User,
  ) {
    return this.vehiculosService.createGasolina(
      vehiculoId,
      createGasolinaDto,
      user,
    );
  }

  @Get(':vehiculoId/gasolinas')
  @ApiOperation({ summary: 'Listar cargas de combustible de un vehículo' })
  findAllGasolinas(
    @Param('vehiculoId', ParseUUIDPipe) vehiculoId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.vehiculosService.findAllGasolinas(vehiculoId, paginationDto);
  }

  @Get('gasolina/:gasolinaId')
  @ApiOperation({ summary: 'Obtener un registro de gasolina por ID' })
  findOneGasolina(@Param('gasolinaId', ParseUUIDPipe) gasolinaId: string) {
    return this.vehiculosService.findOneGasolina(gasolinaId);
  }

  @Patch('gasolina/:gasolinaId')
  @ApiOperation({ summary: 'Actualizar un registro de gasolina' })
  updateGasolina(
    @Param('gasolinaId', ParseUUIDPipe) gasolinaId: string,
    @Body() updateGasolinaDto: UpdateGasolinaVehiculoDto,
  ) {
    return this.vehiculosService.updateGasolina(gasolinaId, updateGasolinaDto);
  }

  @Delete('gasolina/:gasolinaId')
  @ApiOperation({ summary: 'Eliminar un registro de gasolina' })
  removeGasolina(@Param('gasolinaId', ParseUUIDPipe) gasolinaId: string) {
    return this.vehiculosService.removeGasolina(gasolinaId);
  }

  @Get('gasolinas/area/:areaId')
  @ApiOperation({ summary: 'Listar cargas de combustible por área' })
  findAllGasolinasByArea(
    @Param('areaId', ParseUUIDPipe) areaId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.vehiculosService.findAllGasolinasByArea(areaId, paginationDto);
  }
}
