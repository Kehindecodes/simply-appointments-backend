import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { currency } from '../enum/currency.enum';
import { User } from './User';

Entity();
export class Service {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column()
    serviceName?: string;

    @Column()
    description?: string;

    @Column()
    isActive?: boolean;

    @Column() // use the currency enum here
    currency?: currency;

    @Column()
    price?: number;

    @Column()
    duration?: number;
    required?: [
        "name",
        "price"
    ];
    @Column()
    availability?: boolean
    default?: true

    // @OneToMany(() => User, (user) => user.service)
    // users?: User[]

    declare createdAt?: Date
}
