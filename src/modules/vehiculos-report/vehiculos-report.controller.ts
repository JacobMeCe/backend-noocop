import { Controller } from '@nestjs/common';
import { VehiculosReportService } from './vehiculos-report.service';

@Controller('vehiculos-report')
export class VehiculosReportController {
  constructor(private readonly vehiculosReportService: VehiculosReportService) {}
}
