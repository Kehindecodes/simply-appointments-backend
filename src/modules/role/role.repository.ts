import { In } from "typeorm";
import { Role } from "../../shared/database/entity/Role";
import { AppDataSource } from "../../shared/database/migration/data-source";
import { ApiErrorResponse } from "../../shared/utils/ApiErrorResponse";



export const roleRepository = {

    async getRoleByName(roleName: string): Promise<Role | null> {
        if (!roleName || typeof roleName !== 'string') {
            throw new Error('Invalid role name parameter');
        }

        const role = await AppDataSource.manager.findOneBy(Role, {
            name: roleName,
        });
        return role;
    },

    async createRole(roleName: string): Promise<void> {
        const role = AppDataSource.manager.create(Role, {
            name: roleName,
        });
        await AppDataSource.manager.save(role);
    },

    async getRoles(): Promise<Role[]> {
        const roles = await AppDataSource.manager.find(Role);
        return roles;
    },

    async getRoleById(roleId: number): Promise<Role | null> {
        const role = await AppDataSource.manager.findOneBy(Role, {
            id: roleId,
        });
        return role;
    },

    async getRolesByIds(roleIds: number[]): Promise<Role[]> {
       const roles = await AppDataSource.manager.find(Role, {
            where: {
                id: In(roleIds as number[]),
            },
        });
        return roles;
    },

    async deleteRole(role: Role): Promise<void> {
        if (!role) {
            throw new ApiErrorResponse(404, "Role not found");
        }
        await AppDataSource.manager.remove(role);
    }
}
