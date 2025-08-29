import { User } from "../../shared/database/entity/User";
import { AppDataSource } from "../../shared/database/migration/data-source";


export const userRepository = {
    getUserByEmail: async (email: string): Promise<User | null> => {
            const user = await AppDataSource.manager.findOne(User, {
                where: {
                    email,
                },
            });
            return user;

    },

    updateUserPassword: async (email: string, password: string): Promise<void> => {
        await AppDataSource.manager.update(
            User,
            { email },
            { password: password }
        );
    },

    getUserById: async (id: string): Promise<User | null> => {
            const user = await AppDataSource.manager.findOne(User, {
                where: {
                    id
                },
            });
            return user;
    },

    updateUser: async (user: User): Promise<void> => {
        await AppDataSource.manager.update(User, { id: user.id }, user);
    },

    getUsersWithRoleByUserType: async (userType: string): Promise<User[] | null> => {
            const users = await AppDataSource.getRepository(User)
                .createQueryBuilder("user")
                .leftJoinAndSelect("user.role", "role")
                .where("user.userType = :userType", { userType: userType })
                .getMany();
            return users;
    },

    // getUserWithRole: async (id: string): Promise<User | null> => {
    //         const user = await AppDataSource.getRepository(User)
    //             .createQueryBuilder("user")
    //             .leftJoinAndSelect("user.role", "role")
    //             .where("user.id = :id", { id: id })
    //             .getOne();
    //         return user;
    // },

    deleteUser: async (user: User): Promise<void> => {
        user.isDeleted = true;
        await AppDataSource.manager.update(User, { id: user.id }, user);
    },
    getUsers: async (filters: any): Promise<User[] | null> => {
        const users = await AppDataSource.manager.find(User, {
            where: {
                ...filters
            }
        });
        return users;
    }
}

