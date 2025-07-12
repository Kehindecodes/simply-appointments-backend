import { NotFoundError } from "../../errors/NotFoundError";
import { ApiSuccessResponse } from "../../shared/utils/ApiSuccessResponse";
import { permissionRepository } from "./permission.repository";
import { Request, Response } from "express";


export const PermissionController = {
    createPermission: async (req: Request, res: Response): Promise<void> => {
        const { id, name, description, roleIds } = req.body;
        await permissionRepository.create(id, name, description, roleIds);
        res.status(201).json(new ApiSuccessResponse(201, "Permission created successfully"));
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
        res.status(200).json(new ApiSuccessResponse(200, "Permissions fetched successfully", data));
    },
    getRoleWithPermission: async (req: Request, res: Response): Promise<void> => {
        const permissionId = req.params.id;
        const permission = await permissionRepository.getRolePermission(Number(permissionId));
        if (!permission) {
            throw new NotFoundError(`Permission not found with ID ${permissionId}`);
        }
        res.status(200).json(new ApiSuccessResponse(200, "", permission));
    },
}
