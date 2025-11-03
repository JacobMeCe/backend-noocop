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
import { PartidaService } from './partida.service';
import { CreatePartidaDto } from './dto/create-partida.dto';
import { UpdatePartidaDto } from './dto/update-partida.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth } from 'src/auth/decorators';

@Controller('partida')
export class PartidaController {
  constructor(private readonly partidaService: PartidaService) {}

  @Post()
  //@Auth()
  create(@Body() createPartidaDto: CreatePartidaDto) {
    return this.partidaService.create(createPartidaDto);
  }

  @Get()
  // @Auth()
  findAll(@Query() paginatioDto: PaginationDto) {
    return this.partidaService.findAll(paginatioDto);
  }

  @Get(':term')
  @Auth()
  findOne(@Param('term') term: string) {
    return this.partidaService.findOne(term);
  }

  @Get('buscar/partida')
  searchPartidas(
    @Query() paginationDto: PaginationDto,
    @Query('term') term: string,
  ) {
    return this.partidaService.searchPartidas(term, paginationDto);
  }

  @Patch(':id')
  @Auth()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePartidaDto: UpdatePartidaDto,
  ) {
    return this.partidaService.update(id, updatePartidaDto);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.partidaService.remove(id);
  }
}
