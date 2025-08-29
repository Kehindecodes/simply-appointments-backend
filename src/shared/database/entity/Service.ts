import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,
    ManyToMany,
    JoinTable,
} from "typeorm";
import { User } from "./User";
import {
    IsBoolean,
    IsIn,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    MaxLength,
    MinLength,
} from "class-validator";
import { Category } from "../../config/enums/Category";

@Entity()
export class Service {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @MinLength(3, { message: "Service name must be at least 3 characters" })
    @MaxLength(50, { message: "Service name must be at most 50 characters" })
    @IsString({ message: "Service name must be a string" })
    @IsNotEmpty({ message: "Service name is required" })
    @Column()
    serviceName?: string;

    @IsNotEmpty({ message: "Price is required" })
    @IsPositive({ message: "Price must be a positive number" })
    @IsNumber(
        { allowNaN: false, allowInfinity: false },
        { message: "Price must be a number" }
    )
    @Column()
    price?: number;

    @MinLength(3, { message: "Description must be at least 3 characters" })
    @MaxLength(50, { message: "Description must be at most 50 characters" })
    @IsString({ message: "Description must be a string" })
    @IsOptional()
    @Column({
        nullable: true,
    })
    description?: string;

    // @IsBoolean({ message: "Is active must be a boolean" })
    // @IsNotEmpty({ message: "Is active is required" })
    // @IsOptional()
    // @Column()
    // isActive?: boolean;

    @IsString({ message: "Duration must be a string" })
    @IsOptional()
    @Column({
        nullable: true,
    })
    duration?: string;

    @IsBoolean({ message: "Availability must be a boolean" })
    @IsNotEmpty({ message: "Availability is required" })
    @Column(
        {
            default: true,
        }
    )
    availability!: boolean;

    @IsNotEmpty({ message: "Category is required" })
    @IsIn([...Object.values(Category)]) // Use IsIn to validate against the Category enum
    @Column({
        type: "enum",
        enum: Category,
    })
    category!: Category;

    @CreateDateColumn()
    createdAt!: Date;

    @ManyToMany(() => User, (user: User) => user.services)
    @JoinTable()
    users?: User[]

    @Column({
        default: false,
    })
    isDeleted?: boolean;

    /**
     * data
     */
    public data() {
        const createdAtFormatted = this.createdAt.toISOString().split("T")[0];
        return {
            serviceId: this.id,
            serviceName: this.serviceName,
            price: this.price,
            description: this.description,
            // isActive: this.isActive,
            duration: this.duration,
            availability: this.availability,
            category: this.category,
            createdAt: createdAtFormatted,
        };
    }
}