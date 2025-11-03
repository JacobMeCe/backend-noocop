import { Module } from '@nestjs/common';
import { OrdenesCompraReportService } from './ordenes-compra-report.service';
import { OrdenesCompraReportController } from './ordenes-compra-report.controller';
import { PrinterModule } from '../printer/printer.module';
import { OrdenesCompraModule } from '../ordenes-compra/ordenes-compra.module';
import { AuthModule } from 'src/auth/auth.module';
import { AreasModule } from '../areas/areas.module';
import { PartidaModule } from '../partida/partida.module';
import { ProveedorModule } from '../proveedor/proveedor.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenCompra } from '../ordenes-compra/entities';
import { Area } from '../areas/entities/area.entity';
import { Proveedor } from '../proveedor/entities/proveedor.entity';
import { Partida } from '../partida/entities/partida.entity';

@Module({
  controllers: [OrdenesCompraReportController],
  providers: [OrdenesCompraReportService],
  imports: [
    TypeOrmModule.forFeature([OrdenCompra, Area, Proveedor, Partida]),
    PrinterModule,
    OrdenesCompraModule,
    AuthModule,
    AreasModule,
    PartidaModule,
    ProveedorModule,
  ],
})
export class OrdenesCompraReportModule { }
