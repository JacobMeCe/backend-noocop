import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { CreateServicioVehiculoDto } from './dto/create-servicio-vehiculo.dto';
import { UpdateServicioVehiculoDto } from './dto/update-servicio-vehiculo.dto';
import { Vehiculo } from './entities/vehiculo.entity';
import { VehiculoImage } from './entities/vehiculo-image.entity';
import { ServicioVehiculo } from './entities/servicios-vehiculos.entity';
import { Area } from '../areas/entities/area.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class VehiculosService {
  private readonly logger = new Logger('VehiculosService');

  constructor(
    @InjectRepository(Vehiculo)
    private readonly vehiculoRepository: Repository<Vehiculo>,
    @InjectRepository(VehiculoImage)
    private readonly vehiculoImageRepository: Repository<VehiculoImage>,
    @InjectRepository(ServicioVehiculo)
    private readonly servicioRepository: Repository<ServicioVehiculo>,
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,
  ) {}

  // ─── Vehículos ───────────────────────────────────────────────────────────────

  async create(createVehiculoDto: CreateVehiculoDto) {
    const { images, areaId, ...vehiculoDetails } = createVehiculoDto;

    const area = await this.areaRepository.findOne({ where: { id: areaId } });
    if (!area) throw new NotFoundException(`Área con id ${areaId} no encontrada`);

    try {
      const vehiculo = this.vehiculoRepository.create({
        ...vehiculoDetails,
        area,
        images: images?.map((url) => this.vehiculoImageRepository.create({ url })),
      });
      await this.vehiculoRepository.save(vehiculo);
      return vehiculo;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0, term } = paginationDto;

    const qb = this.vehiculoRepository
      .createQueryBuilder('v')
      .leftJoinAndSelect('v.area', 'area')
      .leftJoinAndSelect('v.images', 'images');

    if (term) {
      qb.where(
        `UPPER(v.vehiculo)     LIKE :t
          OR UPPER(v.marca)       LIKE :t
          OR UPPER(v.num_placa)   LIKE :t
          OR UPPER(v.num_economico) LIKE :t
          OR UPPER(v.modelo)      LIKE :t`,
        { t: `%${term.toUpperCase()}%` },
      );
    }

    const [data, totalItems] = await qb
      .orderBy('v.creado_en', 'DESC')
      .take(limit)
      .skip(offset)
      .getManyAndCount();

    return {
      data,
      meta: {
        totalItems,
        limit,
        offset,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: Math.floor(offset / limit) + 1,
      },
    };
  }

  async findOne(id: string) {
    const vehiculo = await this.vehiculoRepository.findOne({
      where: { id },
      relations: ['images', 'servicios'],
    });
    if (!vehiculo) throw new NotFoundException(`Vehículo con id ${id} no encontrado`);
    return vehiculo;
  }

  async update(id: string, updateVehiculoDto: UpdateVehiculoDto) {
    const { areaId, images, ...toUpdate } = updateVehiculoDto;

    const vehiculo = await this.vehiculoRepository.preload({ id, ...toUpdate });
    if (!vehiculo) throw new NotFoundException(`Vehículo con id ${id} no encontrado`);

    if (areaId) {
      const area = await this.areaRepository.findOne({ where: { id: areaId } });
      if (!area) throw new NotFoundException(`Área con id ${areaId} no encontrada`);
      vehiculo.area = area;
    }

    try {
      return await this.vehiculoRepository.save(vehiculo);
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: string) {
    const vehiculo = await this.findOne(id);
    await this.vehiculoRepository.remove(vehiculo);
    return { message: `Vehículo con id ${id} eliminado correctamente` };
  }

  // ─── Servicios ───────────────────────────────────────────────────────────────

  async createServicio(vehiculoId: string, dto: CreateServicioVehiculoDto) {
    const vehiculo = await this.vehiculoRepository.findOne({ where: { id: vehiculoId } });
    if (!vehiculo) throw new NotFoundException(`Vehículo con id ${vehiculoId} no encontrado`);

    try {
      const servicio = this.servicioRepository.create({ ...dto, vehiculo });
      return await this.servicioRepository.save(servicio);
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAllServicios(vehiculoId: string, paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const vehiculoExists = await this.vehiculoRepository.findOne({ where: { id: vehiculoId } });
    if (!vehiculoExists)
      throw new NotFoundException(`Vehículo con id ${vehiculoId} no encontrado`);

    const [data, totalItems] = await this.servicioRepository.findAndCount({
      where: { vehiculo: { id: vehiculoId } },
      order: { fecha_servicio: 'DESC' },
      take: limit,
      skip: offset,
    });

    return {
      data,
      meta: {
        totalItems,
        limit,
        offset,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: Math.floor(offset / limit) + 1,
      },
    };
  }

  async findOneServicio(id: string) {
    const servicio = await this.servicioRepository.findOne({
      where: { id },
      relations: ['vehiculo'],
    });
    if (!servicio) throw new NotFoundException(`Servicio con id ${id} no encontrado`);
    return servicio;
  }

  async updateServicio(id: string, dto: UpdateServicioVehiculoDto) {
    const servicio = await this.servicioRepository.preload({ id, ...dto });
    if (!servicio) throw new NotFoundException(`Servicio con id ${id} no encontrado`);

    try {
      return await this.servicioRepository.save(servicio);
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async removeServicio(id: string) {
    const servicio = await this.findOneServicio(id);
    await this.servicioRepository.remove(servicio);
    return { message: `Servicio con id ${id} eliminado correctamente` };
  }

  private handleDBException(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException('Error inesperado, revise los logs del servidor');
  }
}
