import { Status } from "./../enum/Status";
import {
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsString,
    Matches,
} from "class-validator";
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Transform } from "class-transformer";

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
    @IsNotEmpty({ message: "Appointment time is required" })
    @IsDate({ message: "Appointment time must be a valid date" })
    @Matches(/^\d{2}:\d{2}$/, { message: "Invalid time format. Use HH:mm" })
    @Transform(({ value }) => new Date(value))
    time?: Date;

    @Column()
    @IsNotEmpty({ message: "Appointment date is required" })
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: "Invalid date format. Use YYYY-MM-DD",
    })
    @Transform(({ value }) => new Date(value))
    date?: Date;

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
    status?: string;

    @CreateDateColumn()
    createdAt!: Date;

    public data() {
        // const createdAtFormatted = this.createdAt.toISOString().split("T")[0];
        return {
            id: this.id,
            userId: this.userId,
            time: this.time,
            date: this.date,
            staffId: this.staffId,
            serviceId: this.serviceId,
            status: this.status,
        };
    }
}
