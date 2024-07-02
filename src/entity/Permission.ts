import { Entity, PrimaryColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { Role } from "./Role";

@Entity()
export class Permission {
    @PrimaryColumn()
    id?: number;

    @Column()
    name?: string;

    @Column()
    description?: string;

    @ManyToMany((type) => Role, (role) => role.permissions,{
        cascade: true
    })
    @JoinTable()
    roles?: Role[]
}
