import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index} from "typeorm";
import dotenv from "dotenv";
dotenv.config();
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
// extract the OTP expiration timeout into a configurable constant

public get isExpired(): boolean {
    const OTP_EXPIRATION_TIME = process.env.OTP_EXPIRATION_TIME || 300000; // 5 minutes
    return this.createdAt
      ? Date.now() > this.createdAt.getTime() + Number(OTP_EXPIRATION_TIME)
      : false;
}
    }
