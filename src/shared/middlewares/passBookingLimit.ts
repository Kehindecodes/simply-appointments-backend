import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../database/migration/data-source";
import { CustomRequest } from "../types/custom-express";
import { Appointment } from "../database/entity/Appointment";
import { User } from "../database/entity/User";
import { userRepository } from "../../modules/user/user.repository";

export const passBookingLimit = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    const { staffId, date } = req.body;
    const maxBookingPerDay = 6;
    try {
        const appointments = await AppDataSource.manager.find(Appointment, {
            where: {
                staffId: staffId,
                date: date,
            },
        });

        if (appointments.length >= maxBookingPerDay) {
            const staff = await userRepository.getUserById(staffId);
            return res.status(400).json({
                message: `${staff?.name} has reached the booking limit for the day`,
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
