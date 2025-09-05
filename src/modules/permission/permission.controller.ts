import { NotFoundError } from "../../errors/NotFoundError";
import { permissionRepository } from "./permission.repository";
import { Request, Response } from "express";


export const PermissionController = {
    createPermission: async (req: Request, res: Response): Promise<void> => {
        const { id, name, description, roles } = req.body;
        await permissionRepository.create( name, description, roles);
        res.status(201).json();
    },
    getPermissions: async (req: Request, res: Response): Promise<void> => {
        const permissions = await permissionRepository.getPermissions();
        if (!permissions) {
            throw new NotFoundError("Permissions not found");
        }
        const data = permissions.map((permission) => {
            return {
                id: permission.id,
                name: permission.name,
                description: permission.description,
                roles: permission.roles,
            };
        });
        res.status(200).json(data);
    },
    getRoleWithPermission: async (req: Request, res: Response): Promise<void> => {
        const permissionId = req.params.id;
        const permission = await permissionRepository.getRolePermission(Number(permissionId));
        if (!permission) {
            throw new NotFoundError(`Permission not found with ID ${permissionId}`);
        }
        res.status(200).json(permission);
    },

    createBulkPermissions: async (req: Request, res: Response): Promise<void> => {
        const { permissions } = req.body;
        for (let permission of permissions) {
            await permissionRepository.create(permission.name, permission.description, permission.roles);
        }
        res.status(200).json();
    },

    getPermissionById: async (req: Request, res: Response): Promise<void> => {
        const permissionId = req.params.id;
        const permission = await permissionRepository.getPermissionById(Number(permissionId));
        if (!permission) {
            throw new NotFoundError(`Permission not found with ID ${permissionId}`);
        }
        res.status(200).json(permission);
    },
}
