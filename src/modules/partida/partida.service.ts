import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePartidaDto } from './dto/create-partida.dto';
import { UpdatePartidaDto } from './dto/update-partida.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Partida } from './entities/partida.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class PartidaService {
  private readonly logger = new Logger('PartidaService');

  constructor(
    @InjectRepository(Partida)
    private readonly partidaRepository: Repository<Partida>,
  ) {}

  async create(createPartidaDto: CreatePartidaDto) {
    try {
      const area = this.partidaRepository.create(createPartidaDto);
      await this.partidaRepository.save(area);

      return area;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(paginatioDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginatioDto;
    const [data, count] = await this.partidaRepository.findAndCount({
      take: limit,
      skip: offset,
      order: {
        nombre_partida: 'ASC',
      },
    });

    return {
      data,
      meta: {
        totalItems: count,
        limit,
        offset,
        totalPages: Math.ceil(count / limit),
        currentPage: Math.floor(offset / limit) + 1,
      },
    };
  }

  // findAll(paginatioDto: PaginationDto) {
  //   const { limit = 10, offset = 0 } = paginatioDto;
  //   return this.partidaRepository.find({
  //     take: limit,
  //     skip: offset,
  //     order: {
  //       nombre_partida: 'ASC',
  //     },
  //   });
  // }

  async findOne(term: string) {
    let partida: Partida;

    if (isUUID(term)) {
      partida = await this.partidaRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.partidaRepository.createQueryBuilder();
      partida = await queryBuilder
        .where(
          `numero_partida =:numero_partida or nombre_partida =:nombre_partida`,
          {
            nombre_partida: term,
            numero_partida: term,
          },
        )
        .getOne();
    }

    if (!partida) {
      throw new NotFoundException(`Partida with term ${term} not found`);
    }

    return partida;
  }

  /**
   *
   * @param term
   * @param paginationDto
   * @returns { data: Partida[], meta: any }
   */

  async searchPartidas(
    term: string,
    paginationDto: PaginationDto,
  ): Promise<{ data: Partida[]; meta: any }> {
    const { limit = 10, offset = 0 } = paginationDto;
    let areas: Partida[] = [];
    let count = 0;

    if (term) {
      const queryBuilder = this.partidaRepository.createQueryBuilder();
      [areas, count] = await queryBuilder
        .where(
          `numero_partida =:numero_partida or nombre_partida =:nombre_partida`,
          {
            nombre_partida: term,
            numero_partida: term,
          },
        )
        .take(limit)
        .skip(offset)
        .getManyAndCount();
    } else {
      [areas, count] = await this.partidaRepository.findAndCount({
        take: limit,
        skip: offset,
        order: {
          nombre_partida: 'ASC',
        },
      });
    }

    return {
      data: areas,
      meta: {
        totalItems: count,
        limit,
        offset,
        totalPages: Math.ceil(count / limit),
        currentPage: Math.floor(offset / limit) + 1,
      },
    };
  }

  async update(id: string, updatePartidaDto: UpdatePartidaDto) {
    const partida = await this.partidaRepository.preload({
      id: id,
      ...updatePartidaDto,
    });

    if (!partida)
      throw new NotFoundException(`partida with id: ${id} not found`);

    try {
      await this.partidaRepository.save(partida);
      return partida;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: string) {
    const partida = await this.findOne(id);

    await this.partidaRepository.remove(partida);
    return partida;
  }

  private handleDBException(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error ocurred. Please try again later.',
    );
  }
}
