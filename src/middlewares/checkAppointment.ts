import { NextFunction, Response } from "express";
import { CustomRequest } from "../types/custom-express";
import { AppDataSource } from "../migration/data-source";
import { Appointment } from "../entity/Appointment";

export const checkAppointment = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        // check the route params for valid appointment Id
        let appointmentId = req.params.id;
        if (!appointmentId) {
            //check the parsed body instead
            const post = req.body;
            if (!post.appointmentId) {
                res.status(400).json({ message: "Appointment id is required" });
                return;
            }
            appointmentId = post.appointmentId;
        }
        // query the Appointment entity for an appointment id existence
        const appointment = AppDataSource.getRepository(Appointment).findOneBy({
            id: appointmentId,
        });
        if (!appointment) {
            res.status(404).json({ message: "Appointment not found" });
            return;
        }
        next();
    } catch (error) {
        res.json(errorHandler(error, res));
    }
};
