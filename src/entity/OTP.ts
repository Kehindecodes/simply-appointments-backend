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
    createdAt?: Date

    
    public get getOtp() : string {
        return  this.otp || "";
    }
    public get isExpired() : boolean {
        return  this.createdAt ?  Date.now() > this.createdAt.getTime() + 300000 : false;
    }
    
}