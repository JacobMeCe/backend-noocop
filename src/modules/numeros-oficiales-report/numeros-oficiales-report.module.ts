import { Module } from '@nestjs/common';
import { NumerosOficialesReportService } from './numeros-oficiales-report.service';
import { NumerosOficialesReportController } from './numeros-oficiales-report.controller';
import { NumerosOficiale } from '../numeros-oficiales/entities/numeros-oficiale.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrinterModule } from '../printer/printer.module';
import { NumerosOficialesModule } from '../numeros-oficiales/numeros-oficiales.module';

@Module({
  controllers: [NumerosOficialesReportController],
  providers: [NumerosOficialesReportService],
  imports: [
    TypeOrmModule.forFeature([NumerosOficiale]),
    PrinterModule,
    NumerosOficialesModule,
  ],
})
export class NumerosOficialesReportModule { }
