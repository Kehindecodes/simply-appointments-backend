import { NextFunction, Response } from "express";
import { serviceRepository } from "../../modules/service/service.repository";
import { CustomRequest } from "../types/custom-express";

export const checkService = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        let serviceId = req.params.serviceId;
        if (!serviceId) {
            const post = req.body;
            if (!post.serviceId) {
                res.status(400).json({ message: "Service id is required" });
                return;
            }
            serviceId = post.serviceId;
        }

        const service = await serviceRepository.getServiceById(serviceId);
        if (!service) {
            res.status(404).json({message: "Service not found"});
            return;
        }
        req.service = service;
        next();
    } catch (error) {
        console.error(error)
        res.json(
            {message: "Internal server error"}
        );
    }
};
