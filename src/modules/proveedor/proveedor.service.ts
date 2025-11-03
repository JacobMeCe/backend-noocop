import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { Repository } from 'typeorm';
import { Proveedor } from './entities/proveedor.entity';
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
export class ProveedorService {
  private readonly logger = new Logger('ProveedorService');

  constructor(
    @InjectRepository(Proveedor)
    private proveedorRepository: Repository<Proveedor>,
  ) { }

  async create(createProveedorDto: CreateProveedorDto) {
    try {
      const proveedor = this.proveedorRepository.create(createProveedorDto);
      await this.proveedorRepository.save(proveedor);

      return proveedor;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(paginatioDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginatioDto;
    const [data, count] = await this.proveedorRepository.findAndCount({
      take: limit,
      skip: offset,
      order: {
        nombre_proveedor: 'ASC',
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
    let proveedor: Proveedor;

    if (isUUID(term)) {
      proveedor = await this.proveedorRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.proveedorRepository.createQueryBuilder();
      proveedor = await queryBuilder
        .where(`codigo_proveedor = :codigo OR nombre_proveedor = :nombre OR rfc = :rfc`, {
          codigo: term,
          nombre: term,
          rfc: term,
        })
        .getOne();
    }

    if (!proveedor) {
      this.handleDBException(`Proveedor with term ${term} not found`);
    }

    return proveedor;
  }

  async searchProveedores(term: string, paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const queryBuilder = this.proveedorRepository.createQueryBuilder();
    const [data, count] = await queryBuilder
      .where("nombre_proveedor ILIKE :term OR razon_social ILIKE :term OR rfc ILIKE :term", { term: `%${term}%` })
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

  async update(id: string, updateProveedorDto: UpdateProveedorDto) {
    const proveedor = await this.proveedorRepository.preload({
      id: id,
      ...updateProveedorDto,
    });

    if (!proveedor)
      throw new NotFoundException(`Proveedor with id: ${id} not found`);

    try {
      await this.proveedorRepository.save(proveedor);
      return proveedor;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: string) {
    const proveedor = await this.findOne(id);

    await this.proveedorRepository.remove(proveedor);
    return proveedor;
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
