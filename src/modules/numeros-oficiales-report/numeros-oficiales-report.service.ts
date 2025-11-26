import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { PrinterService } from '../printer/printer.service';
import { NumerosOficiale } from '../numeros-oficiales/entities/numeros-oficiale.entity';
import { Repository } from 'typeorm';
import { getNumerosOficialesReport } from '../reports/getNumerosOficiales.report';

@Injectable()
export class NumerosOficialesReportService
    extends TypeOrmModule
    implements OnModuleInit {
    async onModuleInit() {
        //await this.$connect();
    }

    constructor(
        private readonly printerService: PrinterService,

        @InjectRepository(NumerosOficiale)
        private readonly numerosOficialeRepository: Repository<NumerosOficiale>,
    ) {
        super();
    }

    async printNumeroOficial(numeroOficialeId: string) {
        const numeroOficiale = await this.numerosOficialeRepository.findOne({
            where: { id: numeroOficialeId },
        });

        if (!numeroOficiale) {
            throw new Error('Número oficial no encontrado');
        }

        const docDefinition = getNumerosOficialesReport({
            numeroOficiale,
        });
        const doc = this.printerService.creatPdf(docDefinition);
        return doc;
    }
}
