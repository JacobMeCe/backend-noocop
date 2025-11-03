import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { Proveedor } from '../../proveedor/entities/proveedor.entity';
import { Area } from '../../areas/entities/area.entity';
import { Partida } from '../../partida/entities/partida.entity';

export enum EstadoOrdenCompra {
  ACTIVA = 'activa',
  EN_PROCESO = 'en_proceso',
  COMPLETADA = 'completada',
  CANCELADA = 'cancelada',
  ELIMINADA = 'eliminada'
}

@Entity('ordenes_compra')
export class OrdenCompra {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  serie_orden: string;

  @Column('text')
  folio_orden: string;

  // Relación con Proveedor
  @ManyToOne(() => Proveedor, { eager: true })
  @JoinColumn({ name: 'proveedor_id' })
  proveedor: Proveedor;

  @Column('uuid')
  proveedor_id: string;

  // Relación con Área
  @ManyToOne(() => Area, { eager: true })
  @JoinColumn({ name: 'area_id' })
  area: Area;

  @Column('uuid')
  area_id: string;

  // Relación con Partida
  @ManyToOne(() => Partida, { eager: true })
  @JoinColumn({ name: 'partida_id' })
  partida: Partida;

  @Column('uuid')
  partida_id: string;

  // Destino o aplicación
  @Column('text', { nullable: true })
  aplicacion_destino: string;

  // Estado de la orden
  @Column({
    type: 'enum',
    enum: EstadoOrdenCompra,
    default: EstadoOrdenCompra.ACTIVA
  })
  estado: EstadoOrdenCompra;

  // Relación con Productos
  @OneToMany('ProductoOrdenCompra', 'orden_compra', {
    cascade: true,
    eager: true
  })
  productos: any[];

  // Totales calculados
  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  subtotal: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  porcentaje_descuento: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  descuento: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  iva: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  total: number;

  @CreateDateColumn()
  creado_en: Date;

  @UpdateDateColumn()
  actualizado_en: Date;
}
