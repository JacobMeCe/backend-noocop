import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NumerosOficialesService } from './numeros-oficiales.service';
import { CreateNumerosOficialeDto } from './dto/create-numeros-oficiale.dto';
import { UpdateNumerosOficialeDto } from './dto/update-numeros-oficiale.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@ApiTags('numeros-oficiales')
@Controller('numeros-oficiales')
export class NumerosOficialesController {
  constructor(private readonly numerosOficialesService: NumerosOficialesService) { }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo número oficial' })
  @ApiResponse({ status: 201, description: 'Número oficial creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  create(@Body() createNumerosOficialeDto: CreateNumerosOficialeDto) {
    return this.numerosOficialesService.create(createNumerosOficialeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los números oficiales con paginación' })
  @ApiResponse({ status: 200, description: 'Lista de números oficiales obtenida exitosamente.' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.numerosOficialesService.findAll(paginationDto);
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar números oficiales por término' })
  @ApiResponse({ status: 200, description: 'Resultados de búsqueda obtenidos exitosamente.' })
  search(@Query() paginationDto: PaginationDto) {
    const { term, ...pagination } = paginationDto;
    if (!term) {
      return this.numerosOficialesService.findAll(pagination);
    }
    return this.numerosOficialesService.searchNumerosOficiales(term, pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un número oficial por ID o número de folio' })
  @ApiResponse({ status: 200, description: 'Número oficial encontrado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Número oficial no encontrado.' })
  findOne(@Param('id') id: string) {
    return this.numerosOficialesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un número oficial' })
  @ApiResponse({ status: 200, description: 'Número oficial actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Número oficial no encontrado.' })
  update(@Param('id') id: string, @Body() updateNumerosOficialeDto: UpdateNumerosOficialeDto) {
    return this.numerosOficialesService.update(id, updateNumerosOficialeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un número oficial' })
  @ApiResponse({ status: 200, description: 'Número oficial eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Número oficial no encontrado.' })
  remove(@Param('id') id: string) {
    return this.numerosOficialesService.remove(id);
  }
}
