import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    JoinTable,
} from "typeorm";
import { Service } from "./Service";
// import { Service } from './Service';

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
    required?: ["customer", "staff", "admin"];

    // @Column()
    // address?: string;

    @Column()
    isActive?: boolean;

    @Column()
    qualification?: string;

    @ManyToMany(() => Service)
    @JoinTable() // This decorator is used to define the join table
    bookedServices?: Service[];
}
