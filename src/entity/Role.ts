import{Column, Entity, PrimaryGeneratedColumn, ManyToMany} from "typeorm";
import { Permission } from "./Permission";

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    name?: string;

    @ManyToMany(() => Permission, (permission : Permission) => permission.roles)
    permissions?: Permission[]
}