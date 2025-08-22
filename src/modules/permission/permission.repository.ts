import { NotFoundError } from "../../errors/NotFoundError";
import { Permission } from "../../shared/database/entity/Permission";
import { AppDataSource } from "../../shared/database/migration/data-source";
import { validateEntity } from "../../shared/utils/validateData";
import { roleRepository } from "../role";

export const permissionRepository = {
   async getRolePermission(permissionId: number): Promise<Permission | null> {
    const permission = await AppDataSource.getRepository(Permission)
            .createQueryBuilder("permission")
            .where("permission.id = :id", { id: permissionId })
            .leftJoinAndSelect("permission.roles", "role")
            .getOne();
            if (!permission) {
                throw new NotFoundError(`Permission not found with ID ${permissionId}`);
            }
            return permission;
   },

   async create(id: number, name: string, description: string, roleIds: number[]):Promise<void>{
     const roles = await roleRepository.getRolesByIds(roleIds);

     if (roles.length === 0) {
        throw new NotFoundError(`No roles found with IDs ${roleIds.join(", ")}`);
     }

     const permission = AppDataSource.manager.create(Permission, {
        id,
        name,
        description,
        roles,
     });
     await validateEntity(permission);
     await AppDataSource.manager.save(permission);
   },

   async getPermissions(): Promise<Permission[]> {
    const permissions = await AppDataSource.manager.find(Permission);
    return permissions;
   },
}
