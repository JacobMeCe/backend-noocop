import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Vehiculo } from './vehiculo.entity';

@Entity({ name: 'vehiculo_image' })
export class VehiculoImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  url: string;

  @ManyToOne(() => Vehiculo, (vehiculo) => vehiculo.images, {
    onDelete: 'CASCADE',
  })
  vehiculo: Vehiculo;
}