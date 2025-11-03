import { ApiProperty } from '@nestjs/swagger';
// import { BInmueble } from 'src/b_inmuebles/entities/b_inmueble.entity';
// import { BMueble } from 'src/b_muebles/entities/b_mueble.entity';
// import { Vehiculo } from 'src/vehiculos/entities/vehiculo.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Partida {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({
    type: 'text',
    unique: false,
  })
  nombre_partida: string;

  @ApiProperty()
  @Column({
    type: 'text',
    unique: true,
    nullable: false,
  })
  numero_partida: string;

  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
  })
  creado_en: Date;

  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  actualizado_en: Date;

  // Relaciones comentadas temporalmente hasta que se definan las entidades correspondientes
  // @OneToMany(() => BMueble, (bMueble) => bMueble.codigo_partida)
  // bMuebles: BMueble[];

  // @OneToMany(() => BInmueble, (bInmueble) => bInmueble.partida)
  // bInmueble: BInmueble[];

  // @OneToMany(() => Vehiculo, (vehiculo) => vehiculo.partida)
  // vehiculo: Vehiculo[];
}
