import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index} from "typeorm";

@Entity()
export class  LinkToken {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column()
    token?: string;

    @Column()
    email?: string;

    @Column()
    expiresAt?: Date;

    public get getExpiresAt() : Date {
        return  this.expiresAt || new Date();
    }
}