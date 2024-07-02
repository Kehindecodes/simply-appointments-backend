import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

Entity();
export class Review {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column()
    userId?: string;

    @Column()
    rating?: number;

    @Column()
    status?: boolean;

    @Column()
    createdAt?: Date
}
