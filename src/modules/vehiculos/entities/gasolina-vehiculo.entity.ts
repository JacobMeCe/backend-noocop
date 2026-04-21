import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Vehiculo } from './vehiculo.entity';
import { User } from 'src/users/entities/user.entity';

export enum TipoCombustible {
  REGULAR = 'regular',
  PREMIUM = 'premium',
  DIESEL = 'diesel',
}

@Entity({ name: 'gasolina_vehiculos' })
export class GasolinaVehiculo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('date')
  fecha_carga: Date;

  @Column({ type: 'numeric' })
  kilometraje: number;

  @Column({ type: 'numeric' })
  litros: number;

  @Column({ type: 'numeric' })
  costo_por_litro: number;

  @Column({ type: 'numeric' })
  costo_total: number;

  @Column({
    type: 'enum',
    enum: TipoCombustible,
    default: TipoCombustible.REGULAR,
  })
  tipo_combustible: TipoCombustible;

  @Column({ type: 'text', nullable: true })
  num_factura: string;

  @Column({ type: 'text', nullable: true })
  proveedor: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
  })
  creado_en: Date;

  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  actualizado_en: Date;

  @ManyToOne(() => Vehiculo, (vehiculo) => vehiculo.gasolinas, {
    onDelete: 'CASCADE',
    eager: false,
  })
  vehiculo: Vehiculo;

  @ManyToOne(() => User, { eager: true, nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'creado_por_id' })
  creado_por?: User;

  @Column('uuid', { nullable: true })
  creado_por_id?: string;
}
