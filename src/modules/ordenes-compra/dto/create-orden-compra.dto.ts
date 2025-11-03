import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsUUID,
  IsArray,
  ValidateNested,
  IsNumber,
  IsBoolean,
  Min,
  IsOptional
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductoOrdenDto {
  @ApiProperty({
    description: 'Cantidad del producto',
    example: 10
  })
  @IsNumber()
  @Min(1)
  cantidad: number;

  @ApiProperty({
    description: 'Unidad de medida',
    example: 'piezas'
  })
  @IsString()
  unidad: string;

  @ApiProperty({
    description: 'Descripción del producto',
    example: 'Laptops Dell Inspiron 15"'
  })
  @IsString()
  descripcion: string;

  @ApiProperty({
    description: 'Si se debe desglosar el IVA',
    example: true,
    default: true
  })
  @IsOptional()
  @IsBoolean()
  desglosar_iva?: boolean;

  @ApiProperty({
    description: 'Costo unitario sin IVA',
    example: 15000.00
  })
  @IsNumber()
  @Min(0)
  costo_sin_iva: number;

  @ApiProperty({
    description: 'Importe total del producto (cantidad * costo_sin_iva)',
    example: 150000.00
  })
  @IsNumber()
  @Min(0)
  importe: number;
}

export class CreateOrdenCompraDto {
  @ApiProperty({
    description: 'Serie de la orden de compra',
    example: 'OC'
  })
  @IsString()
  serie_orden: string;

  @ApiProperty({
    description: 'Folio de la orden de compra',
    example: '001'
  })
  @IsString()
  folio_orden: string;

  @ApiProperty({
    description: 'ID del proveedor',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  proveedor_id: string;

  @ApiProperty({
    description: 'ID del área solicitante',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @IsUUID()
  area_id: string;

  @ApiProperty({
    description: 'ID de la partida presupuestal',
    example: '123e4567-e89b-12d3-a456-426614174002'
  })
  @IsUUID()
  partida_id: string;

  @ApiProperty({
    description: 'Destino o aplicación de la orden de compra',
    example: 'Equipamiento de oficinas administrativas',
    required: false
  })
  @IsOptional()
  @IsString()
  aplicacion_destino?: string;

  @ApiProperty({
    description: 'Porcentaje de descuento aplicado',
    example: 5.00,
    default: 0
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  porcentaje_descuento?: number;

  @ApiProperty({
    description: 'Lista de productos de la orden',
    type: [CreateProductoOrdenDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductoOrdenDto)
  productos: CreateProductoOrdenDto[];
}
