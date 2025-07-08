import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class BusinessHour {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column({ type: "date", nullable: true })
    date?: Date;

    @Column({ type: "time", nullable: true })
    startTime?: string;

    @Column({ type: "time", nullable: true })
    endTime?: string;
}
