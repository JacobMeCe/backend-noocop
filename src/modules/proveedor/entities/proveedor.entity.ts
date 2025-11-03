import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('proveedor')
export class Proveedor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  codigo_proveedor: string;

  @Column('text')
  nombre_proveedor: string;

  @Column('text')
  razon_social: string;

  @Column('text')
  origen_proveedor: string;

  @Column('text')
  entidad_federativa: string;

  @Column('text')
  pais_origen: string;

  @Column('text')
  rfc: string;

  @Column('text')
  actividad_economica: string;

  @Column('text')
  domicilio: string;

  @Column('text')
  poblacion: string;

  @Column('text')
  codigo_postal: string;

  @Column('text')
  representante_legal: string;

  @Column('text')
  telefono: string;

  @Column('text')
  email: string;

  @Column('text', { nullable: true })
  pagina_web: string;

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
