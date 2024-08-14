import { UserService } from "../../entity/UserService";
import { AppDataSource } from "../../migration/data-source";
import { User } from "../../entity/User";
import { Service } from "../../entity/Service";
import { Request, Response } from "express";

export const addServiceToUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const id = req.body;
        const userId = req.params.userId;
        const serviceId = req.params.serviceId;
        const user = await AppDataSource.manager.findOneBy(User, {
            id: userId,
        });
        if (!user) {
            res.json({
                message: "User not found",
                status: 404,
            });
            return; // this exit the function early because the goal of finding the user failed in the first place
        }

        const service = await AppDataSource.manager.findOneBy(Service, {
            id: serviceId,
        });
        if (!service) {
            res.json({
                message: "Service not found",
                status: 404,
            });
            return; // this exit the function early because the goal of finding the service failed in the first place
        }

        const userService = new UserService();
        userService.id = id;
        userService.userId = user.id;
        userService.serviceId = service.id;
        await AppDataSource.manager.save(userService);
        res.json({
            message: "Service added to user successfully",
            status: 200,
        });
    } catch (error) {
        res.json({
            message: error,
            status: 500,
        });
    }
};
