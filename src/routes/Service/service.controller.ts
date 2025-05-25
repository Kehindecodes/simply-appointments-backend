import { AppDataSource } from "./../../migration/data-source";
import { Service } from "./../../entity/Service";
import { ResponseStatus } from "./../../model/response-status";
import { validate } from "class-validator";
import { Request, Response } from "express";
import { Category } from "../../enum/Category";

export const createService = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const {
            category,
            serviceName,
            description,
            duration,
            price,
            isActive,
            availability,
        } = req.body;

        // get the id from the params
        const id = req.params.id;

        const service = new Service();
        service.category = category;
        service.serviceName = serviceName;
        service.description = description;
        service.duration = duration;
        service.price = price;
        service.isActive = isActive;
        service.availability = availability;

        // validate the service
        const errors = await validate(service);
        if (errors.length > 0) {
            // If there are validation errors, return the first error message
            const errorMessage = errors[0].constraints
                ? Object.values(errors[0].constraints)[0]
                : "Validation error";
            res.status(400).json({ message: errorMessage });
            return;
        }
        // save the service
        await AppDataSource.manager.save(service);
        res.json({
            success: true,
            status: 201,
            message: "Service created successfully",
        });
    } catch (error) {
        res.json({
            message: error,
            status: 500,
        });
    }
};

// get single service via serviceId

export const getService = async (req: Request, res: Response) => {
    try {
        const service = await AppDataSource.manager.findOne(Service, {
            where: { id: req.params.id },
        });
        if (!service) {
            res.json(ResponseStatus.NOT_FOUND);
        }
        res.status(200).json(service!.data());
    } catch (error) {
        res.json({
            message: error,
            status: 500,
        });
    }
};

// get All Service
export const getServices = async (req: Request, res: Response) => {
    try {
        const service = await AppDataSource.manager.find(Service, {
            order: { createdAt: "DESC" },
            take: 10,
        });
        if (!service) {
            res.json(ResponseStatus.NOT_FOUND);
        }
        res.status(200).json({
            totalRecords: service.length,
            data: service,
        });
        return;
    } catch (error) {
        console.error(error);
    }
};

// delete a service
export const deleteService = async (req: Request, res: Response) => {
    try {
        // delete a service
        const service = await AppDataSource.getRepository(Service).findOneBy({
            id: req.params.id,
        });
        await AppDataSource.manager.remove(service!);
        res.json({
            success: true,
            status: 200,
            message: "Service deleted successfully",
        });
    } catch (error) {
        res.json({
            message: error,
            status: 500,
        });
    }
};

// update a service
export const updateService = async (req: Request, res: Response) => {
    try {
        const serviceId = req.params.serviceId
        const service = await AppDataSource.manager.findBy(Service, {id:serviceId})
        if(!serviceId){
            res.json({
                message: "Service not found",
                status: 404
            })
        }
        const {category, serviceName, description, duration, price, isActive, availability} = req.body
        service[0].category = category
        service[0].serviceName = serviceName
        service[0].description = description
        service[0].duration = duration
        service[0].price = price
        service[0].isActive = isActive
        service[0].availability = availability
        await AppDataSource.manager.save(service[0])
        res.json({
            success: true,
            status: 200,
            message: "Service updated successfully",
        })
    } catch (error) {
        res.json({
            message: error,
            status: 500,
        })
    }
}