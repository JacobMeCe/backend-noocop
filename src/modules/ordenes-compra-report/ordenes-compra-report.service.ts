import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { PrinterService } from '../printer/printer.service';
import { OrdenCompra } from '../ordenes-compra/entities';
import { Repository } from 'typeorm';
import { Area } from '../areas/entities/area.entity';
import { Proveedor } from '../proveedor/entities/proveedor.entity';
import { Partida } from '../partida/entities/partida.entity';
import { getOrdenCompraReport } from '../reports/getOrdenCompra.report';

@Injectable()
export class OrdenesCompraReportService
  extends TypeOrmModule
  implements OnModuleInit {
  async onModuleInit() {
    //await this.$connect();
  }

  constructor(
    private readonly printerService: PrinterService,

    @InjectRepository(OrdenCompra)
    private readonly ordenCompraRepository: Repository<OrdenCompra>,
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,
    @InjectRepository(Proveedor)
    private readonly proveedorRepository: Repository<Proveedor>,
    @InjectRepository(Partida)
    private readonly partidaRepository: Repository<Partida>,
  ) {
    super();
  }

  async ordenCompra(ordenCompraId: string) {
    const OrdenCompra = await this.ordenCompraRepository.findOne({
      where: {
        id: ordenCompraId,
      },
      relations: [
        'area',
        'partida',
        'proveedor',
      ],
    });

    if (!OrdenCompra) {
      throw new Error(`Orden de compra not found with id: ${ordenCompraId}`);
    }

    const docDefinition = getOrdenCompraReport({
      OrdenCompra,
    });
    const doc = this.printerService.creatPdf(docDefinition);
    return doc;
  }
}
