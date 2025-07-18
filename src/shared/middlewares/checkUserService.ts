import { NextFunction, Response } from "express";
import { CustomRequest } from "../types/custom-express";
import { AppDataSource } from "../database/migration/data-source";
import { UserService } from "../database/entity/UserService";

export const checkUserService = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        let userServiceId = req.params.userServiceId;
        if (!userServiceId) {
            userServiceId = req.body.userServiceId;
        }
        if (!userServiceId) {
            return res.json({
                status: 400,
                message: "user service id is required",
            });
        }
        const userService = await AppDataSource.getRepository(
            UserService
        ).findOneBy({
            id: userServiceId,
        });
        if (!userService) {
            return res.status(404).json({
                message: "user service not found",
            });
        }
        next();
    } catch (error) {
        return res.json({
            status: 500,
            message: error,
        });
    }
};
