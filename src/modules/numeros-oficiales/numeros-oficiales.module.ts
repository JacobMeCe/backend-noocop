import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NumerosOficialesService } from './numeros-oficiales.service';
import { NumerosOficialesController } from './numeros-oficiales.controller';
import { NumerosOficiale } from './entities/numeros-oficiale.entity';
import { NumerosOficialeImage } from './entities/numeros-oficiale-image.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [NumerosOficialesController],
  providers: [NumerosOficialesService],
  imports: [
    TypeOrmModule.forFeature([
      NumerosOficiale,
      NumerosOficialeImage
    ]),
    AuthModule
  ],
  exports: [NumerosOficialesService, TypeOrmModule]
})
export class NumerosOficialesModule { }
