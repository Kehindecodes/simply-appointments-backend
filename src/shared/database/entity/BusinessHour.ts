import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class BusinessHour {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column({ type: "date" })
    date?: Date;

    @Column({ type: "time" })
    startTime?: string;

    @Column({ type: "time" })
    endTime?: string;
}
