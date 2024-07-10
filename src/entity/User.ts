import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, ManyToOne } from "typeorm";
import { Service } from './Service';

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column()
    firstName?: string;

    @Column()
    lastName?: string;

    @Column()
    email?: string;

    @Column()
    phone?: string;

    @Column()
    userType?: string;
    required?: [
        "customer", 
        "staff", 
        "admin"
    ];

    // @Column()
    // address?: string;

    @Column()
    isActive?: boolean;

    @Column()
    qualification?: string

    // @ManyToOne(type => Service, service => service.users)
    // service?: Service
}
