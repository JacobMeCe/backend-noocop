import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenesCompraService } from './ordenes-compra.service';
import { OrdenesCompraController } from './ordenes-compra.controller';
import { OrdenCompra } from './entities/ordenes-compra.entity';
import { ProductoOrdenCompra } from './entities/producto-orden-compra.entity';
import { Proveedor } from '../proveedor/entities/proveedor.entity';
import { Area } from '../areas/entities/area.entity';
import { Partida } from '../partida/entities/partida.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrdenCompra,
      ProductoOrdenCompra,
      Proveedor,
      Area,
      Partida
    ])
  ],
  controllers: [OrdenesCompraController],
  providers: [OrdenesCompraService],
  exports: [OrdenesCompraService]
})
export class OrdenesCompraModule { }
