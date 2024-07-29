import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
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

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @IsNotEmpty({ message: "Name cannot be empty" })
    @IsString()
    @Column()
    name?: string;

    @IsNotEmpty({ message: "Email cannot be empty" })
    @IsEmail({}, { message: "Invalid email format" })
    @Column()
    email?: string;

    @IsNotEmpty({ message: "Phone number cannot be empty" })
    @IsPhoneNumber("NG", { message: "Invalid phone number format" })
    @Column()
    phoneNumber?: string;

    @IsNotEmpty({ message: "Password cannot be empty" })
    @MinLength(5, { message: "Password must be at least 5 characters long" })
    @MaxLength(15, { message: "Password must not exceed 15 characters" })
    @Column()
    password?: string;

    @IsNotEmpty({ message: "Address cannot be empty" })
    @IsString()
    @Column()
    address?: string;

    @IsNotEmpty({ message: "User type cannot be empty" })
    @IsIn(["Customer", "Staff", "Admin"], { message: "Invalid user type" })
    @Column()
    userType?: string;

    @ManyToOne(() => Role , (role: Role) => role.users, { eager: true, nullable: true })
    @JoinColumn({ name: 'roleId'})
    role?: Role
}
