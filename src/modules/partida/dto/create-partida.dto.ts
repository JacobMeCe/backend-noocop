import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class CreatePartidaDto {

    @ApiProperty()
    @IsString()
    @MinLength(1)
    numero_partida: string;

    @ApiProperty()
    @IsString()
    @MinLength(1)
    nombre_partida: string;
}
