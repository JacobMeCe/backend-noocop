import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { EstadoOrdenCompra } from '../entities/ordenes-compra.entity';

export class CambiarEstadoOrdenDto {
    @ApiProperty({
        description: 'Nuevo estado de la orden de compra',
        enum: EstadoOrdenCompra,
        example: EstadoOrdenCompra.EN_PROCESO
    })
    @IsEnum(EstadoOrdenCompra)
    estado: EstadoOrdenCompra;
}

export class FiltroEstadoOrdenDto {
    @ApiProperty({
        description: 'Filtrar órdenes por estado',
        enum: EstadoOrdenCompra,
        required: false,
        example: EstadoOrdenCompra.ACTIVA
    })
    @IsEnum(EstadoOrdenCompra)
    estado?: EstadoOrdenCompra;
}
