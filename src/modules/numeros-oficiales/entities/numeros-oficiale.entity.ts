import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('numeros_oficiales')
export class NumerosOficiale {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 50, unique: true })
    numeroFolio: string;

    // Ubicación del predio
    @Column({ type: 'varchar', length: 100 })
    CtaPredial: string;

    @Column({ type: 'varchar', length: 100 })
    claveCatastral: string;

    @Column({ type: 'text' })
    direccion: string;

    @Column({ type: 'varchar', length: 100 })
    colonia: string;

    // Destino del predio
    @Column({ type: 'varchar', length: 100 })
    usoSuelo: string;

    @Column({ type: 'varchar', length: 200, nullable: true })
    otro: string;

    // Datos del propietario
    @Column({ type: 'varchar', length: 200 })
    nombrePropietario: string;

    @Column({ type: 'text' })
    domicilioPropietario: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    telefonoPropietario: string;

    // Entre Calles
    @Column({ type: 'varchar', length: 100, nullable: true })
    entreCalleNorte: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    entreCalleSur: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    entreCalleEste: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    entreCalleOeste: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    frenteLote: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    distanciaEsquinaDerecha: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    distanciaEsquinaIzquierda: string;

    @Column({ type: 'text', nullable: true })
    observaciones: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
