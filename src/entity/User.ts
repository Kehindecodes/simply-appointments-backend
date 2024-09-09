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
import { Service } from './Service';
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
    @MaxLength(15, { message: "Password must not exceed 15 characters" })
    @IsNotEmpty({ message: "Password cannot be empty" })
    @Column()
    password?: string;

    @IsString()
    @IsNotEmpty({ message: "Address cannot be empty" })
    @Column()
    address?: string;

    @IsNotEmpty({ message: "User type cannot be empty" })
    @IsIn(["Customer", "Staff", "Admin"], { message: "Invalid user type" })
    @Column()
    userType?: string;

    @ManyToOne(() => Role , (role: Role) => role.users, { eager: true, nullable: true })
    @JoinColumn({ name: 'roleId'})
    role?: Role
    
    @ManyToOne(() => Service , (service: Service) => service.users, { eager: true, nullable: true })
    @JoinColumn({ name: 'serviceId'})
    service?: Service
     
    public set resetPassword(password: string) {
        this.password = password;
    }

    public get userId() : string | undefined {
        return this.id;
    }

    public set updateUserType(userType: string) {
        this.userType = userType;
    }

    public set updateRole(role: Role) {
        this.role = role;
    }
}
