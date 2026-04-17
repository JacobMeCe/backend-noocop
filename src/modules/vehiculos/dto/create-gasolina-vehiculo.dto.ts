import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TipoCombustible } from '../entities/gasolina-vehiculo.entity';

export class CreateGasolinaVehiculoDto {
  @ApiProperty({
    description: 'Fecha en que se realizó la carga de combustible',
  })
  @IsDateString()
  fecha_carga: string;

  @ApiProperty({
    description: 'Kilometraje del vehículo al momento de la carga',
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  kilometraje: number;

  @ApiProperty({ description: 'Litros de combustible cargados' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  litros: number;

  @ApiProperty({ description: 'Costo por litro de combustible' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  costo_por_litro: number;

  @ApiProperty({
    description: 'Costo total de la carga (litros × costo_por_litro)',
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  costo_total: number;

  @ApiProperty({
    enum: TipoCombustible,
    description: 'Tipo de combustible: regular, premium o diesel',
    default: TipoCombustible.REGULAR,
  })
  @IsEnum(TipoCombustible)
  tipo_combustible: TipoCombustible;

  @ApiProperty({
    required: false,
    description: 'Número de factura o ticket de la carga',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  num_factura?: string;

  @ApiProperty({
    required: false,
    description: 'Nombre de la gasolinera o proveedor',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  proveedor?: string;

  @ApiProperty({ required: false, description: 'Observaciones adicionales' })
  @IsOptional()
  @IsString()
  observaciones?: string;
}
