import { PartialType } from '@nestjs/swagger';
import { CreateServicioVehiculoDto } from './create-servicio-vehiculo.dto';

export class UpdateServicioVehiculoDto extends PartialType(CreateServicioVehiculoDto) {}
