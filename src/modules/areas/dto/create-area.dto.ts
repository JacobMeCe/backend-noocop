import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class CreateAreaDto {
    @ApiProperty({
        description: 'Nombre del área',
        example: 'Recursos Humanos'
    })
    @IsString()
    @MinLength(1)
    nombre: string;

    @ApiProperty({
        description: 'Código único del área',
        example: 'RH001'
    })
    @IsString()
    @MinLength(1)
    codigo_area: string;

    @ApiProperty({
        description: 'Nombre del encargado del área',
        example: 'Juan Pérez González'
    })
    @IsString()
    @MinLength(1)
    encargado: string;

    @ApiProperty({
        description: 'Puesto del encargado',
        example: 'Director de Recursos Humanos'
    })
    @IsString()
    @MinLength(1)
    puesto: string;
}
