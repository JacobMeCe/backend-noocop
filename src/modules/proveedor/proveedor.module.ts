import { Module } from '@nestjs/common';
import { ProveedorService } from './proveedor.service';
import { ProveedorController } from './proveedor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proveedor } from './entities/proveedor.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ProveedorController],
  providers: [ProveedorService],
  imports: [TypeOrmModule.forFeature([Proveedor]), AuthModule],
  exports: [ProveedorService, TypeOrmModule],
})
export class ProveedorModule {}
