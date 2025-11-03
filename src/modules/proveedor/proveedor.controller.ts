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
import { ProveedorService } from './proveedor.service';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth } from 'src/auth/decorators';

@Controller('proveedor')
export class ProveedorController {
  constructor(private readonly proveedorService: ProveedorService) { }

  @Post()
  //@Auth()
  create(@Body() createProveedorDto: CreateProveedorDto) {
    return this.proveedorService.create(createProveedorDto);
  }

  @Get()
  //@Auth()
  findAll(@Query() paginatioDto: PaginationDto) {
    return this.proveedorService.findAll(paginatioDto);
  }

  @Get(':term')
  //@Auth()
  findOne(@Param('term') term: string) {
    return this.proveedorService.findOne(term);
  }

  @Get('buscar/proveedor')
  searchProveedores(
    @Query() paginationDto: PaginationDto,
    @Query('term') term: string,
  ) {
    return this.proveedorService.searchProveedores(term, paginationDto);
  }

  @Patch(':id')
  //@Auth()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProveedorDto: UpdateProveedorDto,
  ) {
    return this.proveedorService.update(id, updateProveedorDto);
  }

  @Delete(':id')
  //@Auth()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.proveedorService.remove(id);
  }
}
