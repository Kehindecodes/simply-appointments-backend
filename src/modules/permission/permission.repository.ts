import { NotFoundError } from "../../errors/NotFoundError";
import { Permission } from "../../shared/database/entity/Permission";
import { Role } from "../../shared/database/entity/Role";
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

   async create(name: string, description: string, roleIds: number[]):Promise<void>{
     let roles: Role[] = [];
     for (let roleId of roleIds) {
      const role = await roleRepository.getRoleById(roleId);
      if (!role) {
          throw new NotFoundError(`Role not found with ID ${roleId}`);
      }
      roles.push(role);
  }
     if (roles.length === 0) {
        throw new NotFoundError(`No roles found with IDs ${roleIds.join(", ")}`);
     }
       const permission = new Permission();
       permission.name = name;
       permission.description = description;
       permission.roles = roles;
     await validateEntity(permission);
     await AppDataSource.manager.save(permission);
   },

   async getPermissions(): Promise<Permission[]> {
    const permissions = await AppDataSource.manager.find(Permission);
    return permissions;
   },

   async getPermissionById(permissionId: number): Promise<Permission | null> {
    const permission = await AppDataSource.manager.findOneBy(Permission, {
        id: permissionId,
    });
    return permission;
   },
}
