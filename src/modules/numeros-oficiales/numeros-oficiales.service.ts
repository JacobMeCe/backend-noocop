import { CreateNumerosOficialeDto } from './dto/create-numeros-oficiale.dto';
import { UpdateNumerosOficialeDto } from './dto/update-numeros-oficiale.dto';
import { Repository } from 'typeorm';
import { NumerosOficiale } from './entities/numeros-oficiale.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class NumerosOficialesService {
  private readonly logger = new Logger('NumerosOficialesService');

  constructor(
    @InjectRepository(NumerosOficiale)
    private numerosOficialesRepository: Repository<NumerosOficiale>,
  ) { }

  async create(createNumerosOficialeDto: CreateNumerosOficialeDto) {
    try {
      const numeroOficial = this.numerosOficialesRepository.create(createNumerosOficialeDto);
      await this.numerosOficialesRepository.save(numeroOficial);

      return numeroOficial;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(paginatioDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginatioDto;
    const [data, count] = await this.numerosOficialesRepository.findAndCount({
      take: limit,
      skip: offset,
      order: {
        numeroFolio: 'ASC',
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
    let numeroOficial: NumerosOficiale;

    if (isUUID(term)) {
      numeroOficial = await this.numerosOficialesRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.numerosOficialesRepository.createQueryBuilder();
      numeroOficial = await queryBuilder
        .where(`numeroFolio =:numeroFolio`, {
          numeroFolio: term,
        })
        .getOne();
    }

    if (!numeroOficial) {
      throw new NotFoundException(`Número oficial con término ${term} no encontrado`);
    }

    return numeroOficial;
  }

  async searchNumerosOficiales(term: string, paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const queryBuilder = this.numerosOficialesRepository.createQueryBuilder();
    const [data, count] = await queryBuilder
      .where("numeroFolio ILIKE :term OR nombrePropietario ILIKE :term OR direccion ILIKE :term", { term: `%${term}%` })
      .take(limit)
      .skip(offset)
      .getManyAndCount();

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

  async update(id: string, updateNumerosOficialeDto: UpdateNumerosOficialeDto) {
    const numeroOficial = await this.numerosOficialesRepository.preload({
      id: id,
      ...updateNumerosOficialeDto,
    });

    if (!numeroOficial)
      throw new NotFoundException(`Número oficial con id: ${id} no encontrado`);

    try {
      await this.numerosOficialesRepository.save(numeroOficial);
      return numeroOficial;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: string) {
    const numeroOficial = await this.findOne(id);

    await this.numerosOficialesRepository.remove(numeroOficial);
    return numeroOficial;
  }

  private handleDBException(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error occurred. Please try again later.',
    );
  }
}
