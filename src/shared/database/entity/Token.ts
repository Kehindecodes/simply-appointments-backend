import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index} from "typeorm";

@Entity()
export class  LinkToken {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column()
    token?: string;

    @Column()
    @Index()
    email?: string;

    @Column({ nullable: false })
    expiresAt!: Date;

    public get isExpired(): boolean {
        return this.expiresAt < new Date();
    }
}