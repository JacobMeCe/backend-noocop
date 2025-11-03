import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NumerosOficialesService } from './numeros-oficiales.service';
import { NumerosOficialesController } from './numeros-oficiales.controller';
import { NumerosOficiale } from './entities/numeros-oficiale.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NumerosOficiale])],
  controllers: [NumerosOficialesController],
  providers: [NumerosOficialesService],
})
export class NumerosOficialesModule { }
