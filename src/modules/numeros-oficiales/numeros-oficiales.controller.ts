import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NumerosOficialesService } from './numeros-oficiales.service';
import { CreateNumerosOficialeDto } from './dto/create-numeros-oficiale.dto';
import { UpdateNumerosOficialeDto } from './dto/update-numeros-oficiale.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from 'src/users/entities/user.entity';

@ApiTags('numeros-oficiales')
@Controller('numeros-oficiales')
export class NumerosOficialesController {
  constructor(private readonly numerosOficialesService: NumerosOficialesService) { }

  @Post()
  @Auth(ValidRoles.numeros_oficiales)
  @ApiOperation({ summary: 'Crear un nuevo número oficial' })
  @ApiResponse({ status: 201, description: 'Número oficial creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  create(@Body() createNumerosOficialeDto: CreateNumerosOficialeDto, @GetUser() user: User) {
    return this.numerosOficialesService.create(createNumerosOficialeDto, user.id);
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
  @Auth(ValidRoles.numeros_oficiales)
  @ApiOperation({ summary: 'Actualizar un número oficial' })
  @ApiResponse({ status: 200, description: 'Número oficial actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Número oficial no encontrado.' })
  update(@Param('id') id: string, @Body() updateNumerosOficialeDto: UpdateNumerosOficialeDto, @GetUser() user: User) {
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
