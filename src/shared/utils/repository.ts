import { AppDataSource } from "../database/migration/data-source";

import { DeepPartial, SaveOptions } from "typeorm";

export const repository = {
    async save(entity: any, options?: SaveOptions): Promise<void> {
        try {
            return await AppDataSource.manager.save(entity, options);
        } catch (error) {
            console.error('Error saving entity:', error);
            throw error;
        }
    }
}