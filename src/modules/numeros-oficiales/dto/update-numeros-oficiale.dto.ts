import { PartialType } from '@nestjs/swagger';
import { CreateNumerosOficialeDto } from './create-numeros-oficiale.dto';

export class UpdateNumerosOficialeDto extends PartialType(CreateNumerosOficialeDto) {}
