 import{Column, Entity, PrimaryGeneratedColumn, ManyToMany, ManyToOne, OneToMany, JoinTable} from "typeorm";
import { Permission } from "./Permission";
import { User } from "./User";
import { IsNotEmpty } from "class-validator";

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id?: number;

    @IsNotEmpty()
    @Column()
    name?: string;
    @ManyToMany(() => Permission, (permission : Permission) => permission.roles)
    permissions?: Permission[]
  @JoinTable({
           name: "role_permissions",
            joinColumn: { name: "role_id", referencedColumnName: "id" },
            inverseJoinColumn: { name: "permission_id", referencedColumnName: "id" }
        })

    @OneToMany(()=> User, (user: User) => user.role)
    users?: User[]

}