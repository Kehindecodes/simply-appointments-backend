import { UserService } from "../../entity/UserService";
import { AppDataSource } from "../../shared/database/migration/data-source";
import { User } from "../../entity/User";
import { Service } from "../../entity/Service";
import { Request, Response } from "express";

export const addServiceToUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
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
            return;
        }
        const service = await AppDataSource.manager.findOneBy(Service, {
            id: serviceId,
        });
        if (!service) {
            res.json({
                message: "Service not found",
                status: 404,
            });
            return;
        }
        const userService = new UserService();
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

export const getUsersService = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = req.params.userId;
        const user = await AppDataSource.manager.findOneBy(User, {
            id: userId,
        });
        if (!user) {
            res.json({
                message: "User not found",
                status: 404,
            });
            return;
        }
        const userServices = await AppDataSource.manager.find(UserService, {
            where: {
                userId: user.id,
            },
        });
        res.json({
            message: "User services found successfully",
            status: 200,
            data: userServices.map((userService) => userService.data()),
        });
    } catch (error) {
        res.json({
            message: error,
            status: 500,
        });
    }
}
