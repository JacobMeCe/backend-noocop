import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { NumerosOficiale } from "./numeros-oficiale.entity";

@Entity('numeros_oficiales_images')
export class NumerosOficialeImage {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    url: string;


    @ManyToOne(
        () => NumerosOficiale,
        (numeroOficiale) => numeroOficiale.images,
        { onDelete: 'CASCADE' })
    numeroOficiale: NumerosOficiale;
}