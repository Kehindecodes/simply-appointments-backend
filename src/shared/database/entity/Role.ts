 import{Column, Entity, PrimaryGeneratedColumn, ManyToMany, ManyToOne, OneToMany} from "typeorm";
import { Permission } from "./Permission";
import { User } from "./User";

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    name?: string;

    @ManyToMany(() => Permission, (permission : Permission) => permission.roles)
    permissions?: Permission[]

    @OneToMany(()=> User, (user: User) => user.role)
    users?: User[]

}