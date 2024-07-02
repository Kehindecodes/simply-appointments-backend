import { Request, Response } from "express";
import { Permission } from "../../entity/Permission";
import { AppDataSource } from "../../migration/data-source";
import fs from "fs";
import path from "path";
import { Role } from "../../entity/Role";
import { In } from "typeorm";

// const permissionPath = path.join(__dirname, "../../../", "permission.json");
// // const rolePermissionPath = path.join(__dirname,'../../../','rolePermission.json');

// let permissions;

// export const createBulkPermission = async (
//     req: Request,
//     res: Response
// ): Promise<void> => {
//     try {
//         const data = fs.readFileSync(permissionPath, "utf-8");
//         permissions = JSON.parse(data);

//         for (const permissionItem of permissions) {
//             const existingPermission = await AppDataSource.manager.findOneBy(
//                 Permission,
//                 {
//                     id: permissionItem.id,
//                 }
//             );

//             if (existingPermission) {
//                res.status(400).send({
//                     message: "Permission already exists",
//                 });
//                 continue;
//             }
//             let existingRoles = [];
//             // get the role from the database
//         //   const permissionRoles : number[] =  permissionItem.roles
//             for (const role of permissionItem.roles!) {
//                 const existingRole = await AppDataSource.manager.findOneBy(
//                     Role,
//                     {
//                         id: role,
//                     }
//                 );
//                 if (existingRole) {
//                     existingRoles.push(existingRole);
//                 }
//             }
//             // console.log(existingRoles);
//             permissionItem.roles = existingRoles;
//             await AppDataSource.manager.insert(Permission, permissionItem);

//         }

//         res.status(201).send({
//             message: "Permissions created successfully",
//         });
//     } catch (err: any) {
//         console.error(`Error reading permission.json file: ${err}`);
//         res.status(500).send({
//             message: "Error creating permissions",
//             error: err.message,
//         });
//     }
// };

export const createPermission = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id, name, description, roleIds } = req.body;
        const permission = new Permission();
        permission.id = id;
        permission.name = name;
        permission.description = description;
        // Find the existing roles
        const roles = await AppDataSource.manager.find(Role, {
            where: {
                id: In(roleIds as number[]),
            },
        });

        if (roles.length === 0) {
            throw new Error(`No roles found with IDs ${roleIds.join(", ")}`);
        }

        // Associate the permission with the existing roles
        permission.roles = roles;

        // Save the permission
        await AppDataSource.manager.save(permission);
        res.status(201).json(permission);
    } catch (err: any) {
        console.error(`Error creating permission: ${err}`);
        res.status(500).send({
            message: "Error creating permission",
            error: err.message,
        });
    }
};

export const getPermission = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        let data = [];
        const permissions = await AppDataSource.manager.find(Permission);
        for (const permission of permissions) {
            data.push(permission);
        }
        res.status(200).json(data);
    } catch (err: any) {
        console.error(`Error reading permission.json file: ${err}`);
        res.status(500).send({
            message: "Error creating permissions",
            error: err.message,
        });
    }
};

// get role permissions

export const getRolePermission = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        // let rolePermissions = [];
        const permission = await AppDataSource.getRepository(Permission)
            .createQueryBuilder("permission")
            .where("permission.id = :id", { id: req.params.id })
            .leftJoinAndSelect("permission.roles", "role")
            .getOne();
        if (!permission) {
            res.status(404).send({
                message: "permission not found",
            });
            return;
        }
        res.status(200).json(permission);
    } catch (err: any) {
        res.status(500).send({
            message: "Error in get role and permissions",
            error: err.message,
        });
    }
};

//   export const creatbulkRolePermission = async (req: Request, res: Response) : Promise<void> =>{
//     try {
//         const data = fs.readFileSync(rolePermissionPath, 'utf-8');
//         const rolePermissions: RolePermission[] = JSON.parse(data);

//         for (const rolePermissionItem of rolePermissions) {
//           const existingRolePermission = await AppDataSource.manager.findOneBy(RolePermission, {
//             id: rolePermissionItem.id,
//           });

//           if (!existingRolePermission) {
//             await AppDataSource.manager.insert(RolePermission, rolePermissionItem);
//           }
//         }

//         res.status(201).send({
//           message: "Role Permissions created successfully",
//         });
//       } catch (err: any) {
//         console.error(`Error reading role permission.json file: ${err}`);
//         res.status(500).send({
//           message: "Error creating role permissions",
//           error: err.message,
//         });
//       }
//   }
