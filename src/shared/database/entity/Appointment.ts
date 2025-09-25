import { IsEnum, IsNotEmpty, IsString, Matches } from "class-validator";
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
} from "class-validator";
import { AppointmentStatus } from "../../config/enums/AppointmentStatus";

function IsNotPastDate(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "isNotPastDate",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const date = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date >= today;
                },
                defaultMessage(args: ValidationArguments) {
                    return "Appointment date cannot be in the past";
                },
            },
        });
    };
}

@Entity()
export class Appointment {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @IsString()
    @IsNotEmpty({ message: "User Id is required" })
    @Column()
    userId?: string;

    @IsNotEmpty({ message: "Appointment time is required" })
    @Column({type: "timestamptz"})
    time?: Date;

    @Column({type: "timestamptz"})
    endTime?: Date;

    @IsNotPastDate()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: "Invalid date format. Use YYYY-MM-DD",
    })
    @IsNotEmpty({ message: "Appointment date is required" })
    @Column({type: "date"})
    date?: Date;

    @IsString()
    @IsNotEmpty({ message: "Staff Id is required" })
    @Column()
    staffId?: string;

    @IsString()
    @IsNotEmpty({ message: "service Id is required" })
    @Column()
    serviceId?: string;

    @IsEnum(AppointmentStatus)
    @Column()
    status?: AppointmentStatus;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @Column({
        default: false,
    })
    isDeleted?: boolean;

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
