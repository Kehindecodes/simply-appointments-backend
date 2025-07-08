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
            // Use proper logging instead of console.error
            throw new Error(`Failed to retrieve user by email: ${err.message}`);
        }
    },
}

