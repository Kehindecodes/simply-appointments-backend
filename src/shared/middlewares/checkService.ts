import { NextFunction, Response } from "express";
import { AppDataSource } from "../database/migration/data-source";
import { Service } from "../database/entity/Service";
import { serviceRepository } from "../../modules/service/service.repository";
import { ApiErrorResponse } from "../utils/ApiErrorResponse";
import { CustomRequest } from "../types/custom-express";

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

        const service = await serviceRepository.getServiceById(serviceId);
        if (!service) {
            res.status(404).json(new ApiErrorResponse(404, "Service not found"));
            return;
        }
        req.service = service;
        next();
    } catch (error) {
        console.error(error)
        res.json(
            new ApiErrorResponse(500, "Internal server error")
        );
    }
};
