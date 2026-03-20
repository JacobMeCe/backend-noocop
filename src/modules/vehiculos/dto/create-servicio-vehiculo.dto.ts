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
import { TipoServicio } from '../entities/servicios-vehiculos.entity';

export class CreateServicioVehiculoDto {
  @ApiProperty({ enum: TipoServicio, description: 'Tipo: preventivo o correctivo' })
  @IsEnum(TipoServicio)
  tipo_servicio: TipoServicio;

  @ApiProperty({ description: 'Fecha en que se realizó el servicio' })
  @IsDateString()
  fecha_servicio: string;

  @ApiProperty({ required: false, description: 'Kilometraje al ingreso del servicio' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  km_entrada?: number;

  @ApiProperty({ required: false, description: 'Kilometraje estimado para el próximo servicio' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  km_proximo_servicio?: number;

  @ApiProperty({ description: 'Descripción del trabajo realizado' })
  @IsString()
  @MinLength(1)
  descripcion: string;

  @ApiProperty({ required: false, description: 'Nombre del taller o proveedor' })
  @IsOptional()
  @IsString()
  nombre_taller?: string;

  @ApiProperty({ required: false, description: 'Costo total del servicio' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  costo?: number;

  @ApiProperty({ required: false, description: 'Observaciones adicionales' })
  @IsOptional()
  @IsString()
  observaciones?: string;
}
