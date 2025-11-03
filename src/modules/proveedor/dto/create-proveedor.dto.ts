import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsEmail, IsOptional } from 'class-validator';

export class CreateProveedorDto {
  @ApiProperty({
    description: 'Código único del proveedor',
    example: 'PROV001'
  })
  @IsString()
  @MinLength(1)
  codigo_proveedor: string;

  @ApiProperty({
    description: 'Nombre comercial del proveedor',
    example: 'Proveedor ABC S.A.'
  })
  @IsString()
  @MinLength(1)
  nombre_proveedor: string;

  @ApiProperty({
    description: 'Razón social del proveedor',
    example: 'Proveedor ABC Sociedad Anónima'
  })
  @IsString()
  @MinLength(1)
  razon_social: string;

  @ApiProperty({
    description: 'Origen del proveedor (nacional/internacional)',
    example: 'Nacional'
  })
  @IsString()
  @MinLength(1)
  origen_proveedor: string;

  @ApiProperty({
    description: 'Entidad federativa donde se ubica el proveedor',
    example: 'Ciudad de México'
  })
  @IsString()
  @MinLength(1)
  entidad_federativa: string;

  @ApiProperty({
    description: 'País de origen del proveedor',
    example: 'México'
  })
  @IsString()
  @MinLength(1)
  pais_origen: string;

  @ApiProperty({
    description: 'RFC del proveedor',
    example: 'ABC123456789'
  })
  @IsString()
  @MinLength(1)
  rfc: string;

  @ApiProperty({
    description: 'Actividad económica principal',
    example: 'Servicios de consultoría'
  })
  @IsString()
  @MinLength(1)
  actividad_economica: string;

  @ApiProperty({
    description: 'Domicilio completo del proveedor',
    example: 'Av. Principal 123, Col. Centro'
  })
  @IsString()
  @MinLength(1)
  domicilio: string;

  @ApiProperty({
    description: 'Población o municipio',
    example: 'México'
  })
  @IsString()
  @MinLength(1)
  poblacion: string;

  @ApiProperty({
    description: 'Código postal',
    example: '06000'
  })
  @IsString()
  @MinLength(1)
  codigo_postal: string;

  @ApiProperty({
    description: 'Nombre del representante legal',
    example: 'Juan Pérez González'
  })
  @IsString()
  @MinLength(1)
  representante_legal: string;

  @ApiProperty({
    description: 'Número de teléfono de contacto',
    example: '+52 55 1234 5678'
  })
  @IsString()
  @MinLength(1)
  telefono: string;

  @ApiProperty({
    description: 'Correo electrónico de contacto',
    example: 'contacto@proveedorabc.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Página web del proveedor',
    example: 'https://www.proveedorabc.com',
    required: false
  })
  @IsOptional()
  @IsString()
  pagina_web?: string;
}
