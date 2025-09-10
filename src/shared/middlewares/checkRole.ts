import { Response, NextFunction } from "express";
import { CustomRequest } from "../types/custom-express";
import { roleRepository } from "../../modules/role/role.repository";
import { DatabaseError } from "../../errors/DatabaseError";

export const checkRole = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        let roleId = Number(req.params.roleId);
        if (!roleId) {
            const reqBody = req.body;
            if (!reqBody.roleId) {
                res.status(400).json({message: "roleId is required"});
                return;
            }
            roleId = Number(reqBody.roleId);
        }
        const role = await roleRepository.getRoleById(roleId);
        if (!role) {
            res.status(404).json({message: "Role not found"});
            return;
        }
        req.role = role;
        next();
    } catch (err: any) {
        console.error(`Error getting role.json file: ${err}`);
        throw new DatabaseError("Error retrieving role");
    }
};
