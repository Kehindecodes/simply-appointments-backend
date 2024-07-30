import { NextFunction, Response } from "express";
import { CustomRequest } from "../types/custom-express";
import { AppDataSource } from "../migration/data-source";
import { Service } from "../entity/Service";

export const checkService = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        // check the route params for valid service Id
        let serviceId = req.params.id;
        if (!serviceId) {
            //check the parsed body instead
            const post = req.body;
            if (!post.serviceId) {
                res.status(400).json({ message: "Service id is required" });
                return;
            }
            serviceId = post.serviceId;
        }

        const service = AppDataSource.getRepository(Service).findOneBy({
            id: serviceId,
        });
        if (!service) {
            res.status(404).json({ message: "Service not found" });
            return;
        }
        next();
    } catch (error) {
        res.json({
            message: error,
            status: 500,
        });
    }
};
