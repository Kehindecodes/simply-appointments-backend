import { DataSource } from "typeorm";
import { User } from "../entity/User";
import { Permission } from "../entity/Permission";
import { Role } from "../entity/Role";
import dotenv from "dotenv";
import { Service } from "../entity/Service";
import { OTP } from "../entity/OTP";
import { Appointment } from "../entity/Appointment";

dotenv.config();

const {
    DB_HOST,
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
    DB_DATABASE,
    SSLROOTCERT,
} = process.env;

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.PGHOST || DB_HOST,
    port: Number(process.env.PGPORT || DB_PORT),
    username: process.env.PGUSER || DB_USERNAME,
    password: process.env.PGPASSWORD || DB_PASSWORD,
    database: process.env.PGDATABASE || DB_DATABASE,
    extra: {
        ssl: {
            rejectUnauthorized: true,
            sslmode: "require",
            sslrootcert: SSLROOTCERT,
        },
        timezone: "UTC",
    },
    synchronize: true,
    logging: true,
    entities: [User, Service, Permission, Role, OTP, Appointment],
    subscribers: [],
    migrations: [],
});

export async function init() {
    try {
        await AppDataSource.initialize();
        console.log("Database has been initialized!");
    } catch (error) {
        console.error("Database connection error: ", error);
    }
}

export async function close() {
    try {
        await AppDataSource.destroy();
        console.log("Database has been closed!");
    } catch (error) {
        console.error("Database connection error: ", error);
    }
}
