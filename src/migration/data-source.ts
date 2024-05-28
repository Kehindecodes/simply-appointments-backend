import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME, DB_DATABASE } = process.env

export const AppDataSource = new DataSource({
    type: "postgres",
    host: DB_HOST,
    port: Number(DB_PORT),
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    synchronize: true,
    logging: true,
    entities: [],
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