import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable } from "typeorm";
import {
    IsEmail,
    MinLength,
    MaxLength,
    IsNotEmpty,
    IsPhoneNumber,
    IsString,
    IsIn,
} from "class-validator";
import { Role } from "./Role";
import { Service } from './Service';
import { UserType } from "../../config/enums/UserType";
@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @IsString()
    @IsNotEmpty({ message: "Name cannot be empty" })
    @Column()
    name?: string;

    @IsEmail({}, { message: "Invalid email format" })
    @IsNotEmpty({ message: "Email cannot be empty" })
    @Column()
    email?: string;

    @IsPhoneNumber("NG", { message: "Invalid phone number format" })
    @IsNotEmpty({ message: "Phone number cannot be empty" })
    @Column()
    phoneNumber?: string;

    @MinLength(5, { message: "Password must be at least 5 characters long" })
    @MaxLength(100, { message: "Password must not exceed 100 characters" })
    @IsNotEmpty({ message: "Password cannot be empty" })
    @Column()
    password?: string;

    @IsString()
    @IsNotEmpty({ message: "Address cannot be empty" })
    @Column()
    address?: string;

    @IsNotEmpty({ message: "User type cannot be empty" })
    @IsIn([...Object.values(UserType)], { message: "Invalid user type" })
    @Column({
        type: "enum",
        enum: UserType
    })
    userType?: UserType;

    @ManyToOne(() => Role , (role: Role) => role.users, { eager: true, nullable: true })
    @JoinColumn({ name: 'roleId'})
    role?: Role

    @ManyToMany(() => Service , (service: Service) => service.users)
        services?: Service[]
        @JoinTable({ name: 'user_service' ,
            joinColumn: { name: 'user_id', referencedColumnName: 'id' },
            inverseJoinColumn: { name: 'service_id', referencedColumnName: 'id' },

        })
        service?: Service

    @Column({default: true})
    isAvailable?: boolean;

    @Column({
        default: false,
    })
    isDeleted?: boolean;
}
