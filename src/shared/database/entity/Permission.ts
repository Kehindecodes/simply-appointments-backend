import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { Role } from "./Role";

@Entity()
export class Permission {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ unique: true })
    name?: string;

    @Column({ nullable: true })
    description?: string;

    @ManyToMany(() => Role, (role) => role.permissions)
    @JoinTable()
    roles?: Role[];
}
