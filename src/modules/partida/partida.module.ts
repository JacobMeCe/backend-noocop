import { Module } from '@nestjs/common';
import { PartidaService } from './partida.service';
import { PartidaController } from './partida.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partida } from './entities/partida.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [PartidaController],
  providers: [PartidaService],
  imports: [TypeOrmModule.forFeature([Partida]), AuthModule],
  exports: [PartidaService, TypeOrmModule],
})
export class PartidaModule {}
