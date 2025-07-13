import { Request, Response } from "express";
import roleService from "./role.service";
import { ApiSuccessResponse } from "../../shared/utils/ApiSuccessResponse";
import { CustomRequest } from "../../shared/types/custom-express";
import { roleRepository } from "./role.repository";
import { NotFoundError } from "../../errors/NotFoundError";

export const roleController = {

    async addNewRole(req: Request, res: Response): Promise<void> {
        await roleRepository.createRole(req.body.roleName);
        res.status(201).json(new ApiSuccessResponse(201, "Role added successfully"));
    },

    async getRoles(req: Request, res: Response): Promise<void> {
        const roles = await roleService.getRoles();
        res.status(200).json(new ApiSuccessResponse(200, "Roles fetched successfully", roles));
    },

    async getRole(req: CustomRequest, res: Response): Promise<void> {
        const role = req.role
        if (!role) {
            throw new NotFoundError("Role not found");
        }
        res.status(200).json(new ApiSuccessResponse(200, "Role fetched successfully", role));
    },

    async deleteRole(req: CustomRequest, res: Response): Promise<void> {
        const role = req.role
        if (!role) {
            throw new NotFoundError("Role not found");
        }
        await roleRepository.deleteRole(role);
        res.status(200).json(new ApiSuccessResponse(200, "Role deleted successfully"));
    }
}
