import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';

@Entity('productos_orden_compra')
export class ProductoOrdenCompra {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Relación con Orden de Compra
  @ManyToOne('OrdenCompra', 'productos', {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'orden_compra_id' })
  orden_compra: any;

  @Column('uuid')
  orden_compra_id: string;

  @Column('int')
  cantidad: number;

  @Column('text')
  unidad: string;

  @Column('text')
  descripcion: string;

  @Column('boolean', { default: true })
  desglosar_iva: boolean;

  @Column('decimal', { precision: 12, scale: 2 })
  costo_sin_iva: number;

  @Column('decimal', { precision: 12, scale: 2 })
  importe: number;

  // Campos calculados automáticamente
  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  iva_producto: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  total_producto: number;
}
