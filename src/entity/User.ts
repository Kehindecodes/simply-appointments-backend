import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, ManyToOne } from "typeorm";
import { Service } from './Service';

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column()
    name?: string;

    @Column()
    email?: string;

    @Column()
    phoneNumber?: string;

    @Column()
    password?: string;

    @Column()
    address?: string;

    @Column()
    userType?: string;
    required?: [
        "customer", 
        "staff", 
        "admin"
    ];

    // @ManyToOne(type => Service, service => service.users)
    // service?: Service
}
