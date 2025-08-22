import { Column, Entity, ManyToMany, JoinTable } from "typeorm";
import { User } from "./User";
import { Service } from "./Service";

@Entity()
export class Staff extends User {
    @Column({default: true})
    isAvailable?: boolean;

    @ManyToMany(() => Service , (service: Service) => service.staffs)
    services?: Service[]
    @JoinTable({ name: 'staff_service' ,
        joinColumn: { name: 'staff_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'service_id', referencedColumnName: 'id' },

    })
    service?: Service
}

