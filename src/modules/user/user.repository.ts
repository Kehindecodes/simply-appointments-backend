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

  updateUserPassword: async (
    email: string,
    password: string
  ): Promise<void> => {
    await AppDataSource.manager.update(User, { email }, { password: password });
  },

  getUserById: async (id: string): Promise<User | null> => {
    const user = await AppDataSource.manager.findOne(User, {
      where: {
        id,
      },
    });
    return user;
  },

  updateUser: async (user: User): Promise<void> => {
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

  getUsersWithRoleByUserType: async (
    userType: string
  ): Promise<User[] | null> => {
    const users = await AppDataSource.getRepository(User)
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.role", "role")
      .where("user.userType = :userType", { userType: userType })
      .getMany();
    return users;
  },


  deleteUser: async (user: User): Promise<void> => {
    await AppDataSource.manager.update(User, { id: user.id }, { isDeleted: true });
  },

//   addServiceToStaff: async (staff: User, service: Service): Promise<void> => {
//     const staffWithServices = await userRepository.getStaffWithServices(staff);
//     let services = staffWithServices!.services! || [];
//     services.push(service);
//     staff.services = services;
//     await AppDataSource.manager.save(staff);
//   },

addServiceToStaff: async (staff: User, service: Service): Promise<void> => {
    await AppDataSource
      .createQueryBuilder()
      .relation(User, "services")
      .of(staff.id)
      .add(service.id);
  },
  getUserWithServices: async (user: User): Promise<User[] | null> => {
    const usersServices = await AppDataSource.manager
      .createQueryBuilder(User, "user")
      .leftJoinAndSelect("user.services", "service")
      .where("user.id = :userId", { userId: user.id })
      .getMany();
    return usersServices;
  },
  getStaffWithServices: async (staff: User): Promise<User | null> => {
    const userServices = await AppDataSource.manager
      .createQueryBuilder(User, "user")
      .leftJoinAndSelect("user.services", "service")
      .where("user.id = :userId", { userId: staff.id })
      .getOne();
    return userServices;
  },
  deleteUserService: async (user: User, service: Service): Promise<void> => {
    await AppDataSource
      .createQueryBuilder()
      .relation(User, "services")
      .of(user.id)
      .remove(service.id);
  },

  updateUserRole: async (user: User, role: Role): Promise<void> => {
    await AppDataSource
    .createQueryBuilder()
    .relation(User, "role")
    .of(user.id)
    .update(role!.id!);
  },

};
