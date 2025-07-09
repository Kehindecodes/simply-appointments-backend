import { User } from "../../shared/database/entity/User";
import { AppDataSource } from "../../shared/database/migration/data-source";


export const userRepository = {
    getUserByEmail: async (email: string): Promise<User | null> => {
        if (!email || typeof email !== 'string') {
            throw new Error('Invalid email parameter');
        }

        try {
            const user = await AppDataSource.manager.findOne(User, {
                where: {
                    email,
                },
            });
            return user;
        } catch (err: any) {
            throw new Error(`Failed to retrieve user by email: ${err.message}`);
        }
    },

    updateUserPassword: async (email: string, password: string): Promise<void> => {
        try {
            await AppDataSource.manager.update(
                User,
                { email },
                { password: password }
            );
        } catch (err: any) {
            throw new Error(`Failed to update user password: ${err.message}`);
        }
    },

    getUserById: async (id: string): Promise<User | null> => {
        if (!id || typeof id !== 'string') {
            throw new Error('Invalid id parameter');
        }

        try {
            const user = await AppDataSource.manager.findOne(User, {
                where: {
                    id,
                },
            });
            return user;
        } catch (err: any) {
            throw new Error(`Failed to retrieve user by id: ${err.message}`);
        }
    }
}

