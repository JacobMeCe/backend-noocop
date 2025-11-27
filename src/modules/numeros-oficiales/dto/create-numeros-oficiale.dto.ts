import { IsString, IsOptional, MaxLength, MinLength, IsUUID, IsArray, IsNumber, Min } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class CreateNumerosOficialeDto {

    @ApiPropertyOptional({
        description: 'Número de folio único del número oficial (se genera automáticamente si no se proporciona)',
        example: '0004331',
        maxLength: 50
    })
    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(50)
    numeroFolio?: string;

    // Ubicación del predio
    @ApiProperty({
        description: 'Cuenta predial del inmueble',
        example: '12345678901234567890'
    })
    @IsString()
    @MaxLength(100)
    CtaPredial: string;

    @ApiProperty({
        description: 'Clave catastral del inmueble',
        example: 'CC-001-002-003'
    })
    @IsString()
    @MaxLength(100)
    claveCatastral: string;

    @ApiProperty({
        description: 'Dirección completa del inmueble',
        example: 'Calle Principal #123, Col. Centro'
    })
    @IsString()
    direccion: string;

    @ApiProperty({
        description: 'Colonia donde se ubica el inmueble',
        example: 'Centro'
    })
    @IsString()
    @MaxLength(100)
    colonia: string;

    // Destino del predio
    @ApiProperty({
        description: 'Uso de suelo del inmueble',
        example: 'Habitacional'
    })
    @IsString()
    @MaxLength(100)
    usoSuelo: string;

    @ApiPropertyOptional({
        description: 'Otro uso de suelo específico',
        example: 'Comercial mixto'
    })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    otro?: string;

    // Datos del propietario
    @ApiProperty({
        description: 'Nombre completo del propietario',
        example: 'Juan Pérez García'
    })
    @IsString()
    @MaxLength(200)
    nombrePropietario: string;

    @ApiProperty({
        description: 'Domicilio del propietario',
        example: 'Av. Reforma #456, Col. Moderna'
    })
    @IsString()
    domicilioPropietario: string;

    @ApiPropertyOptional({
        description: 'Teléfono del propietario',
        example: '5551234567'
    })
    @IsOptional()
    @IsString()
    @MaxLength(20)
    telefonoPropietario?: string;

    // Entre Calles
    @ApiPropertyOptional({
        description: 'Calle al norte del inmueble',
        example: 'Calle Norte'
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    entreCalleNorte?: string;

    @ApiPropertyOptional({
        description: 'Calle al sur del inmueble',
        example: 'Calle Sur'
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    entreCalleSur?: string;

    @ApiPropertyOptional({
        description: 'Calle al este del inmueble',
        example: 'Calle Este'
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    entreCalleEste?: string;

    @ApiPropertyOptional({
        description: 'Calle al oeste del inmueble',
        example: 'Calle Oeste'
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    entreCalleOeste?: string;

    @ApiPropertyOptional({
        description: 'Medida del frente del lote',
        example: '10.50 m'
    })
    @IsOptional()
    @IsString()
    @MaxLength(20)
    frenteLote?: string;

    @ApiPropertyOptional({
        description: 'Distancia a la esquina derecha',
        example: '25.30 m'
    })
    @IsOptional()
    @IsString()
    @MaxLength(20)
    distanciaEsquinaDerecha?: string;

    @ApiPropertyOptional({
        description: 'Distancia a la esquina izquierda',
        example: '18.70 m'
    })
    @IsOptional()
    @IsString()
    @MaxLength(20)
    distanciaEsquinaIzquierda?: string;

    @ApiPropertyOptional({
        description: 'Observaciones adicionales',
        example: 'Predio en esquina con acceso por dos calles'
    })
    @IsOptional()
    @IsString()
    observaciones?: string;

    @ApiPropertyOptional({
        description: 'Número oficial asignado',
        example: '123-A',
        maxLength: 50
    })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    numeroOficialAsignado?: string;

    @ApiPropertyOptional({
        description: 'Monto de derechos',
        example: 1500.50,
        default: 0
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    derechos?: number;

    @ApiPropertyOptional({
        description: 'Monto de forma',
        example: 250.75,
        default: 0
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    forma?: number;

    @ApiPropertyOptional({
        description: 'Importe total (suma de derechos y forma)',
        example: 1751.25,
        default: 0
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    importeTotal?: number;

    @ApiPropertyOptional({
        description: 'ID del usuario que crea el registro (uuid). Normalmente se autoasigna desde el contexto de autenticación.',
        format: 'uuid',
        example: 'd290f1ee-6c54-4b01-90e6-d701748f0851'
    })
    @IsOptional()
    @IsUUID()
    createdById?: string;

    @ApiProperty()
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?: string[];

}
