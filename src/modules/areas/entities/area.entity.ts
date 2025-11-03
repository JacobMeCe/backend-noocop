import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Area {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({
    type: 'text',
    unique: true,
    nullable: false,
  })
  nombre: string;

  @ApiProperty()
  @Column({
    type: 'text',
    unique: true,
    nullable: false,
  })
  codigo_area: string;

  @ApiProperty()
  @Column({
    type: 'text',
    unique: false,
  })
  encargado: string;

  @ApiProperty()
  @Column({
    type: 'text',
    unique: false,
  })
  puesto: string;

  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
  })
  creado_en: Date;

  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  actualizado_en: Date;
}
