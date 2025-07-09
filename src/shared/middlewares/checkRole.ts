import { Response, NextFunction } from "express";
import { Role } from "../database/entity/Role";
import { AppDataSource } from "../database/migration/data-source";
import { CustomRequest } from "../types/custom-express";
import roleService from "../../modules/role/role.service";
import { roleRepository } from "../../modules/role/role.repository";
import { AppValidationError } from "../../errors/AppValidationError";
import { NotFoundError } from "../../errors/NotFoundError";
import { DatabaseError } from "../../errors/DatabaseError";

export const checkRole = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        // check if role exists in the route
        let roleId = Number(req.params.roleId);
        // check the request body
        if (!roleId) {
            const reqBody = req.body;
            if (!reqBody.roleId) {
                throw new AppValidationError("role is required");
            }
            roleId = Number(reqBody.roleId);
        }
        const role = await roleRepository.getRoleById(roleId);
        if (!role) {
            throw new NotFoundError("Role not found");
        }
        // set the role in the request
        req.role = role;
        next();
    } catch (err: any) {
        console.error(`Error getting role.json file: ${err}`);
        throw new DatabaseError("Error retrieving role");
    }
};
