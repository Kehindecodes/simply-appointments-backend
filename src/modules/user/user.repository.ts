import { Role } from "../../shared/database/entity/Role";
import { Service } from "../../shared/database/entity/Service";
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
    },

    addServiceToUser: async (user: User, service: Service): Promise<void> => {
       user.services = [service];
       await AppDataSource.manager.save(user);

    },
    getUserServices: async (user: User): Promise<User[] | null> =>  {
        const userService = await AppDataSource.manager.createQueryBuilder(User,"user")
        .leftJoinAndSelect("user.services", "service")
        .where("user.id = :userId", { userId: user.id })
        .getMany();
        return userService
    },
    deleteUserService: async (user: User) => {
        const userServices = await AppDataSource.manager.findOne(User, {
            relations: {services: true},
            where: {id: user.id}});
        userServices!.services = userServices!.services!.filter((service) => service.id !== service.id);
        await AppDataSource.manager.save(userServices);
    },
    updateUserRole: async(user:User, role:Role): Promise<void> =>{
        user.role = role;
        await userRepository.updateUser(user);
    }

}

