import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VehiculoImage } from './vehiculo-image.entity';
import { Area } from 'src/modules/areas/entities/area.entity';
import { ServicioVehiculo } from './servicios-vehiculos.entity';
import { GasolinaVehiculo } from './gasolina-vehiculo.entity';
import { User } from 'src/users/entities/user.entity';

export enum Propietario {
  MUNICIPIO = 'municipio',
  COMODATO = 'comodato',
}

export enum EstadoVehiculo {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
  RESGUARDO = 'resguardo',
  BAJA = 'baja',
}

@Entity({ name: 'vehiculos' })
export class Vehiculo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true })
  num_inventario: string;

  @Column('text')
  anio_adquisicion: string;

  @Column({ type: 'text', unique: true })
  num_economico: string;

  @Column('date')
  fecha_compra: Date;

  @Column('text')
  vehiculo: string;

  @Column('text')
  marca: string;

  @Column('text')
  modelo: string;

  @Column('text')
  tipo_vehiculo: string;

  @Column('text')
  color: string;

  @Column({ type: 'text', unique: true })
  num_serie: string;

  @Column({ type: 'text', unique: true })
  num_motor: string;

  @Column({ type: 'text', unique: true })
  num_chasis: string;

  @Column({ type: 'text', unique: true })
  num_placa: string;

  @Column('text')
  observaciones: string;

  @Column('text')
  anio_refrendo: string;

  @Column('text')
  folio_refrendo: string;

  @Column('date')
  fecha_refrendo: Date;

  @Column({
    type: 'enum',
    enum: Propietario,
    default: Propietario.MUNICIPIO,
  })
  propietario: Propietario;

  @Column({
    type: 'date',
    nullable: true,
  })
  fecha_inicio: Date;

  @Column({
    type: 'date',
    nullable: true,
  })
  fecha_termino: Date;

  @Column({
    type: 'enum',
    enum: EstadoVehiculo,
    default: EstadoVehiculo.ACTIVO,
  })
  estado: EstadoVehiculo;

  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
  })
  creado_en: Date;

  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  actualizado_en: Date;

  @OneToMany(() => VehiculoImage, (vehiculoImage) => vehiculoImage.vehiculo, {
    cascade: true,
  })
  images?: VehiculoImage[];

  @OneToMany(() => ServicioVehiculo, (servicio) => servicio.vehiculo, {
    cascade: true,
  })
  servicios?: ServicioVehiculo[];

  @OneToMany(() => GasolinaVehiculo, (gasolina) => gasolina.vehiculo, {
    cascade: true,
  })
  gasolinas?: GasolinaVehiculo[];

  @ManyToOne(() => Area, (area) => area.vehiculo, { eager: true })
  area: Area;

  @ManyToOne(() => User, { eager: true, nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'creado_por_id' })
  creado_por?: User;

  @Column('uuid', { nullable: true })
  creado_por_id?: string;
}
