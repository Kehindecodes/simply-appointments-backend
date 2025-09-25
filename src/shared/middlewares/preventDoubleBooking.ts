import { NextFunction, Response } from "express";
import { CustomRequest } from "../types/custom-express";
import { AppDataSource } from "../database/migration/data-source";
import { Appointment } from "../database/entity/Appointment";

export const preventDoubleBooking = async (req: CustomRequest, res: Response, next: NextFunction) => {
        const {time,date} = req.body;
        try{
            const appointment = await AppDataSource.manager.findOne(Appointment, {
                where: {
                    time: new Date(`${date} ${time}`),
                    date:  new Date(date),
                    userId:req.userId
                },
            });
            if(appointment) {
               return res.status(400).json({message: "You already have an appointment scheduled at this time. Please choose a different time slot"});
            }
                next();
        } catch(error) {
            console.error(" Database error:", error);
            res.status(500).json({
                message: "Internal server error during booking process",
            });
        }

    }
