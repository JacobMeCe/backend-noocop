import { ApiProperty } from '@nestjs/swagger';

export class ResponseProveedorSimpleDto {
    @ApiProperty({
        description: 'ID del proveedor',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    id: string;

    @ApiProperty({
        description: 'Código del proveedor',
        example: 'PROV001'
    })
    codigo_proveedor: string;

    @ApiProperty({
        description: 'Nombre del proveedor',
        example: 'Proveedor ABC S.A.'
    })
    nombre_proveedor: string;

    @ApiProperty({
        description: 'RFC del proveedor',
        example: 'ABC123456789'
    })
    rfc: string;
}

export class ResponseAreaDto {
    @ApiProperty({
        description: 'ID del área',
        example: '123e4567-e89b-12d3-a456-426614174001'
    })
    id: string;

    @ApiProperty({
        description: 'Nombre del área',
        example: 'Sistemas'
    })
    nombre: string;
}

export class ResponsePartidaDto {
    @ApiProperty({
        description: 'ID de la partida',
        example: '123e4567-e89b-12d3-a456-426614174002'
    })
    id: string;

    @ApiProperty({
        description: 'Nombre de la partida',
        example: 'Material y Suministros de Administración'
    })
    nombre_partida: string;

    @ApiProperty({
        description: 'Número de la partida presupuestal',
        example: '21101'
    })
    numero_partida: string;
}

export class ResponseProductoOrdenDto {
    @ApiProperty({
        description: 'ID del producto en la orden',
        example: '123e4567-e89b-12d3-a456-426614174003'
    })
    id: string;

    @ApiProperty({
        description: 'Cantidad del producto',
        example: 10
    })
    cantidad: number;

    @ApiProperty({
        description: 'Unidad de medida',
        example: 'piezas'
    })
    unidad: string;

    @ApiProperty({
        description: 'Descripción del producto',
        example: 'Laptops Dell Inspiron 15"'
    })
    descripcion: string;

    @ApiProperty({
        description: 'Si se desglosó el IVA',
        example: true
    })
    desglosar_iva: boolean;

    @ApiProperty({
        description: 'Costo unitario sin IVA',
        example: 15000.00
    })
    costo_sin_iva: number;

    @ApiProperty({
        description: 'Importe total del producto',
        example: 150000.00
    })
    importe: number;

    @ApiProperty({
        description: 'IVA del producto',
        example: 24000.00
    })
    iva_producto: number;

    @ApiProperty({
        description: 'Total del producto con IVA',
        example: 174000.00
    })
    total_producto: number;
}

export class ResponseOrdenCompraDto {
    @ApiProperty({
        description: 'ID de la orden de compra',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    id: string;

    @ApiProperty({
        description: 'Serie de la orden de compra',
        example: 'OC'
    })
    serie_orden: string;

    @ApiProperty({
        description: 'Folio de la orden de compra',
        example: '001'
    })
    folio_orden: string;

    @ApiProperty({
        description: 'Número completo de la orden (serie + folio)',
        example: 'OC-001'
    })
    numero_orden: string;

    @ApiProperty({
        description: 'Información del proveedor',
        type: ResponseProveedorSimpleDto
    })
    proveedor: ResponseProveedorSimpleDto;

    @ApiProperty({
        description: 'Información del área solicitante',
        type: ResponseAreaDto
    })
    area: ResponseAreaDto;

    @ApiProperty({
        description: 'Información de la partida presupuestal',
        type: ResponsePartidaDto
    })
    partida: ResponsePartidaDto;

    @ApiProperty({
        description: 'Destino o aplicación de la orden de compra',
        example: 'Equipamiento de oficinas administrativas',
        required: false
    })
    aplicacion_destino?: string;

    @ApiProperty({
        description: 'Lista de productos de la orden',
        type: [ResponseProductoOrdenDto]
    })
    productos: ResponseProductoOrdenDto[];

    @ApiProperty({
        description: 'Estado de la orden de compra',
        example: 'activa',
        enum: ['activa', 'en_proceso', 'completada', 'cancelada', 'eliminada']
    })
    estado: string;

    @ApiProperty({
        description: 'Subtotal de la orden',
        example: 150000.00
    })
    subtotal: number;

    @ApiProperty({
        description: 'Porcentaje de descuento aplicado',
        example: 5.00
    })
    porcentaje_descuento: number;

    @ApiProperty({
        description: 'Monto del descuento',
        example: 7500.00
    })
    descuento: number;

    @ApiProperty({
        description: 'IVA total',
        example: 22800.00
    })
    iva: number;

    @ApiProperty({
        description: 'Total de la orden',
        example: 165300.00
    })
    total: number;

    @ApiProperty({
        description: 'Fecha de creación',
        example: '2024-01-01T00:00:00.000Z'
    })
    creado_en: Date;

    @ApiProperty({
        description: 'Fecha de última actualización',
        example: '2024-01-01T00:00:00.000Z'
    })
    actualizado_en: Date;
}
