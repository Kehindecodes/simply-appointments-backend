import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index} from "typeorm";

@Entity()
export class OTP {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column()
    otp?: string;

    @Column()
    email?: string;

    @CreateDateColumn()
    @Index({
        expireAfterSeconds: 300
    })
    createdAt?: Date
}