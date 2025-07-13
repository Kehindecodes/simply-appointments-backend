import { IsNotEmpty } from "class-validator";
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class UserService {
    @PrimaryGeneratedColumn("uuid")
    @IsNotEmpty({ message: "User service id is required" })
    id?: string;

    @IsNotEmpty({ message: "User id is required" })
    @Column()
    userId?: string;

    @IsNotEmpty({ message: "Service id is required" })
    @Column()
    serviceId?: string;

    @CreateDateColumn()
    createdAt!: Date;

    public data() {
        const createdAtFormatted = this.createdAt.toISOString().split("T")[0];
        return {
            userServiceId: this.id,
            userId: this.userId,
            serviceId: this.serviceId,
            createdAt: createdAtFormatted,
        };
    }
}
