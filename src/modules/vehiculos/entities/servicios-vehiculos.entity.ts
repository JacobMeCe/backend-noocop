import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Vehiculo } from './vehiculo.entity';
import { User } from 'src/users/entities/user.entity';

export enum TipoServicio {
  PREVENTIVO = 'preventivo',
  CORRECTIVO = 'correctivo',
}

@Entity({ name: 'servicios_vehiculos' })
export class ServicioVehiculo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: TipoServicio,
  })
  tipo_servicio: TipoServicio;

  @Column('date')
  fecha_servicio: Date;

  @Column({ type: 'numeric', nullable: true })
  km_entrada: number;

  @Column({ type: 'numeric', nullable: true })
  km_proximo_servicio: number;

  @Column('text')
  descripcion: string;

  @Column({ type: 'text', nullable: true })
  nombre_taller: string;

  @Column({ type: 'numeric', nullable: true, default: 0 })
  costo: number;

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

  @ManyToOne(() => Vehiculo, (vehiculo) => vehiculo.servicios, {
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
