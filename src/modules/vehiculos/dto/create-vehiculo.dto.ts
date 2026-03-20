import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { Propietario } from '../entities/vehiculo.entity';
import { Type } from 'class-transformer';

export class CreateVehiculoDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @IsOptional()
  num_inventario: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  anio_adquisicion: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  num_economico: string;

  @ApiProperty()
  @IsDateString()
  fecha_compra: Date;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  marca: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  vehiculo: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  modelo: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  tipo_vehiculo: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  color: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  num_serie: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  num_motor: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  num_chasis: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  num_placa: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  observaciones: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  anio_refrendo: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  folio_refrendo: string;

  @ApiProperty()
  @IsDateString()
  fecha_refrendo: Date;

  @ApiProperty()
  @IsEnum(Propietario)
  propietario: Propietario;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  fecha_inicio: Date;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  fecha_termino: Date;

  @ApiProperty()
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];

  @ApiProperty()
  @IsUUID()
  areaId: string;

}