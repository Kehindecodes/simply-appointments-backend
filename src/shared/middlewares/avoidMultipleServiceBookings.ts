import { NextFunction, Response } from "express";
import { CustomRequest } from "../types/custom-express";
import { AppDataSource } from "../database/migration/data-source";
import { Appointment } from "../database/entity/Appointment";
import { Service } from "../database/entity/Service";

export const avoidBookingSameServiceMultipleTimes = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    const { serviceId, date } = req.body;
    try {
        const appointment = await AppDataSource.manager.findOne(Appointment, {
            where: {
                serviceId: serviceId,
                date: date,
                userId: req.userId,
            },
        });
        const service = await AppDataSource.manager.findOne(Service, {
            where: {
                id: serviceId,
            },
        })
        if (appointment) {
            return res.status(400).json({
                message: `You have already booked ${service?.serviceName} for ${date}. Please choose a different service or date`,
            });
        }
        next();
    } catch (error) {
        console.error(" Database error:", error);
        res.status(500).json({
            message: "Internal server error during booking process",
        });
    }
};
