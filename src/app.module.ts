import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import typeorm from './config/typeorm.config';
import { CommonModule } from './common/common.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { NumerosOficialesModule } from './modules/numeros-oficiales/numeros-oficiales.module';
import { OrdenesCompraModule } from './modules/ordenes-compra/ordenes-compra.module';
import { ProveedorModule } from './modules/proveedor/proveedor.module';
import { AreasModule } from './modules/areas/areas.module';
import { PartidaModule } from './modules/partida/partida.module';
import { PrinterModule } from './modules/printer/printer.module';
import { OrdenesCompraReportModule } from './modules/ordenes-compra-report/ordenes-compra-report.module';
import { NumerosOficialesReportModule } from './modules/numeros-oficiales-report/numeros-oficiales-report.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '/public'),
    }),
    CommonModule,
    AuthModule,
    UsersModule,
    NumerosOficialesModule,
    OrdenesCompraModule,
    ProveedorModule,
    AreasModule,
    PartidaModule,
    PrinterModule,
    OrdenesCompraReportModule,
    NumerosOficialesReportModule,
  ],
})
export class AppModule { }
