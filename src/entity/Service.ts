import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { User } from './User';


@Entity()
export class Service {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column()
    serviceName?: string;

    @Column()
    price?: number;

    @Column({
        nullable: true
    })
    description?: string;

    @Column()
    isActive?: boolean;

    @Column({
        nullable: true
    })
    duration?: string;

    @Column()
    availability?: boolean;

    // Add a ManyToMany relationship
    @ManyToMany(() => User)
    @JoinTable() // This decorator is used to define the join table
    users?: User[];
}