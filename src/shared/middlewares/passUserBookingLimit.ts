import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../database/migration/data-source";
import { CustomRequest } from "../types/custom-express";
import { Appointment } from "../database/entity/Appointment";

export const passUserBookingLimit = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    const { date } = req.body;
    if (!date) {
        return res.status(400).json({
            message: "Date is required",
        });
    }
    const maxBookingPerDay = 2;
    try{
        const appointments = await AppDataSource.manager.find(Appointment, {
            where: {
                userId: req.userId,
                date: date,
            },
        });

        if (appointments.length >= maxBookingPerDay) {
           return res.status(400).json({
                message: "You have reached the booking limit for the day",
            });
        }

        next();
    } catch(error)
    {
        console.error(" Database error:", error);
        res.status(500).json({
            message: "Internal server error during booking process",
        });
    }


};
