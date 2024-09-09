import {Request, Response, NextFunction} from "express";
import { AppDataSource } from "../migration/data-source";
import { CustomRequest } from "../types/custom-express";
import { Appointment } from "../entity/Appointment";
import { User } from "../entity/User";


export const passBookingLimit = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const {staffId, date} = req.body;
    const maxBookingPerDay = 6;
    const appointments = await AppDataSource.manager.find(Appointment, {
        where: {
            staffId: staffId,
            date: date
        }
    });

    if(appointments.length >= maxBookingPerDay) {
        const staff = await AppDataSource.manager.findOne(User, { where: { id: staffId } });
        res.status(400).json({message: `${staff?.name} has reached the booking limit for the day`});
    }

    next();
}