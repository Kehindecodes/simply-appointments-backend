import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

Entity();
export class Profile {
    @PrimaryGeneratedColumn("uuid")
    creatorId?: string;

    @Column()
    jobPreference?: string;

    @Column()
    experience?: number;

    @Column()
    image?: boolean;

    @Column()
    suspended?: boolean;

    @Column()
    description?: boolean;

    @Column()
    rating?: boolean;

    @Column()
    reviews?: [];
    
    @Column()
    citizen?: string;

    @Column()
    createdAt?: Date
}
