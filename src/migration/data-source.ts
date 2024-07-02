import { DataSource } from "typeorm";
import {User } from "../entity/User";
import {Permission} from "../entity/Permission";
import {Role} from "../entity/Role";
import dotenv from "dotenv";
 
dotenv.config();

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME, DB_DATABASE } = process.env

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST || DB_HOST,
    port:  Number( process.env.POSTGRES_PORT || DB_PORT),
    username: process.env.POSTGRES_USERNAME || DB_USERNAME,
    password: process.env.POSTGRES_PASSWORD || DB_PASSWORD,
    database:  process.env.POSTGRES_DATABASE || DB_DATABASE,
    synchronize: true,
    logging: true,
    entities: [User,Permission,Role ],
    subscribers: [], 
    migrations: [],
})




export async function init() {
    try{
        await AppDataSource.initialize();
        console.log("Database has been initialized!")
    } catch(error) {
        console.error("Database connection error: ", error)
    }
}

export async function close() {
    try{
        await AppDataSource.destroy();
        console.log("Database has been closed!")
    } catch(error) {
        console.error("Database connection error: ", error)
    }
}