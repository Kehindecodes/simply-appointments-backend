import { Status } from "./../enum/Status";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Appointment {
    @PrimaryGeneratedColumn("uuid")
    @IsNotEmpty({ message: "Appointment Id is required" })
    id?: string;

    @Column()
    @IsString()
    @IsNotEmpty({ message: "User Id is required" })
    userId?: string;

    @Column()
    @IsString()
    @IsNotEmpty({ message: "Appointment time is required" })
    time?: string;

    @Column()
    @IsString()
    @IsNotEmpty({ message: "Staff id is required" })
    staffId?: string;

    @Column()
    @IsString()
    @IsNotEmpty({ message: "service Id is required" })
    serviceId?: string;

    @Column()
    @IsEnum({
        pending: Status.PENDING,
        cancelled: Status.CANCELLED,
        completed: Status.COMPLETED,
        confirmed: Status.CONFIRMED,
        paid: Status.PAID,
        rejected: Status.REJECTED,
    })
    @IsNotEmpty({ message: "Status is required" })
    status?: string;

    @CreateDateColumn()
    createdAt!: Date;

    public data() {
        const createdAtFormatted = this.createdAt.toISOString().split("T")[0];
        return {
            id: this.id,
            userId: this.userId,
            time: this.time,
            staffId: this.staffId,
            serviceId: this.serviceId,
            status: this.status,
            createdAt: createdAtFormatted,
        };
    }
}
