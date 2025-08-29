import { CustomRequest } from "../../shared/types/custom-express";
import { ApiSuccessResponse } from "../../shared/utils/ApiSuccessResponse";
import { serviceRepository } from "./service.repository";
import { Request, Response } from "express";


export const serviceController = {

    createService: async (req: CustomRequest, res: Response) => {
        const {serviceName, description, duration, price} = req.body;
        await serviceRepository.createService(serviceName, description, duration, price);
        res.status(201).json(new ApiSuccessResponse(201, "", ""));
    },

    getService: async (req: CustomRequest, res: Response) => {
        const service = req.service;
        res.status(200).json(new ApiSuccessResponse(200, "", service));
    },

    getAllServices: async (req: CustomRequest, res: Response) => {
        const services = await serviceRepository.getAllServices();
        res.status(200).json(new ApiSuccessResponse(200, "", services));
    },

    updateService: async (req: CustomRequest, res: Response) => {
        const service = req.service;
        const {serviceName, description, duration, price} = req.body;
        service!.serviceName = serviceName;
        service!.description = description;
        service!.duration = duration;
        service!.price = price;
        await serviceRepository.updateService(service!);
        res.status(200).json(new ApiSuccessResponse(200, "", service));
    },

    deleteService: async (req: CustomRequest, res: Response) => {
        const service = req.service;
        await serviceRepository.deleteService(service!);
        res.status(200).json(new ApiSuccessResponse(200, "", service));
    },

}
