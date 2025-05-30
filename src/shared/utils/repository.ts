import { AppDataSource } from "../database/migration/data-source";

export const repository = {
    async save(entity: any, options?: any){
        await AppDataSource.manager.save(entity, options);
    }

}