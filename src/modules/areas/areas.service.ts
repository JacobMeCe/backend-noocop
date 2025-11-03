import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Area } from './entities/area.entity';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';
import { UpdateAreaDto } from './dto/update-area.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class AreasService {
  private readonly logger = new Logger('AreasService');

  constructor(
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,
  ) { }

  async create(createAreaDto: CreateAreaDto) {
    try {
      const area = this.areaRepository.create(createAreaDto);
      await this.areaRepository.save(area);

      return area;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(paginatioDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginatioDto;
    const [data, count] = await this.areaRepository.findAndCount({
      take: limit,
      skip: offset,
      order: {
        nombre: 'ASC',
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

  async findOne(term: string) {
    let area: Area;

    if (isUUID(term)) {
      area = await this.areaRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.areaRepository.createQueryBuilder();
      area = await queryBuilder
        .where(`UPPER(nombre) =:nombre or codigo_area =:codigo_area`, {
          nombre: term.toUpperCase(),
          codigo_area: term,
        })
        .getOne();
    }

    if (!area) {
      throw new NotFoundException(`Area with term ${term} not found`);
    }

    return area;
  }

  async searchAreas(
    term: string,
    paginationDto: PaginationDto,
  ): Promise<{ data: Area[]; meta: any }> {
    const { limit = 10, offset = 0 } = paginationDto;
    let areas: Area[] = [];
    let count = 0;

    if (isUUID(term)) {
      const area = await this.areaRepository.findOneBy({ id: term });
      if (area) {
        areas.push(area);
        count = 1;
      }
    } else {
      const queryBuilder = this.areaRepository.createQueryBuilder();
      [areas, count] = await queryBuilder
        .where(`UPPER(nombre) LIKE :nombre or codigo_area LIKE :codigo_area`, {
          nombre: `%${term.toUpperCase()}%`,
          codigo_area: `%${term}%`,
        })
        .skip(offset)
        .take(limit)
        .getManyAndCount();
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

  async update(id: string, updateAreaDto: UpdateAreaDto) {
    const area = await this.areaRepository.preload({
      id: id,
      ...updateAreaDto,
    });

    if (!area) throw new NotFoundException(`Area with id: ${id} not found`);

    try {
      await this.areaRepository.save(area);
      return area;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: string) {
    const area = await this.findOne(id);

    await this.areaRepository.remove(area);
    return area;
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
