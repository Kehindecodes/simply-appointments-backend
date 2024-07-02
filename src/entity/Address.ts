import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

Entity();
export class Address {
    @PrimaryGeneratedColumn("uuid")
    serviceId?: string;

    @Column()
    serviceName?: string;

    @Column()
    location?: string;

    @Column()
    isActive?: boolean;

    @Column()
    price?: number;

    @Column()
    duration?: number;
    required?: [
        "name",
        "price"
    ];
    
}
