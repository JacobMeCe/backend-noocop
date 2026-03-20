import { Module } from '@nestjs/common';
import { VehiculosService } from './vehiculos.service';
import { VehiculosController } from './vehiculos.controller';
import { AreasService } from '../areas/areas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehiculo } from './entities/vehiculo.entity';
import { VehiculoImage } from './entities/vehiculo-image.entity';
import { ServicioVehiculo } from './entities/servicios-vehiculos.entity';
import { Partida } from '../partida/entities/partida.entity';
import { Area } from '../areas/entities/area.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [VehiculosController],
  providers: [VehiculosService, AreasService,],
  imports: [
    TypeOrmModule.forFeature([
      Vehiculo,
      VehiculoImage,
      ServicioVehiculo,
      Area,
      Partida,
    ]),
    AuthModule,
  ],
  exports: [VehiculosService, TypeOrmModule],
})
export class VehiculosModule {}
