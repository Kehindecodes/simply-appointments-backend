import { AppDataSource } from "../migration/data-source";
import { Service } from "../entity/Service";
import { response } from "express";
const serviceRepository = AppDataSource.getRepository(Service);

export const createService = async (req: any, res: any) => {
    try {
        const { serviceName, price, description, duration } = req.body;
        if (
            serviceName !== "" &&
            price !== "" &&
            description !== "" &&
            duration !== ""
        ) {
            const service = new Service();
            service.serviceName = serviceName;
            service.description = description;
            service.duration = duration;
            service.price = price;
            service.isActive = true;
            service.availability = true;

            await serviceRepository.save(service);
            res.json({
                message: "service created successfully",
                status: 201,
            });
        }
        // handle case where input validation fails
        res.json({
            message: "Invalid input",
            status: 400,
        });
    } catch (error) {
        res.json({
            message: error,
            status: 500,
        });
    }
};
