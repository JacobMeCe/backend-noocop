import { Module } from '@nestjs/common';
import { VehiculosReportService } from './vehiculos-report.service';
import { VehiculosReportController } from './vehiculos-report.controller';

@Module({
  controllers: [VehiculosReportController],
  providers: [VehiculosReportService],
})
export class VehiculosReportModule {}
