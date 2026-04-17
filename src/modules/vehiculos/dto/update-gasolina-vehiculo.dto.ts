import { PartialType } from '@nestjs/swagger';
import { CreateGasolinaVehiculoDto } from './create-gasolina-vehiculo.dto';

export class UpdateGasolinaVehiculoDto extends PartialType(
  CreateGasolinaVehiculoDto,
) {}
