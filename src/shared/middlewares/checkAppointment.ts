import { Response, NextFunction } from "express";
import { CustomRequest } from "../types/custom-express";
import { AppValidationError } from "../../errors/AppValidationError";
import { NotFoundError } from "../../errors/NotFoundError";
import { DatabaseError } from "../../errors/DatabaseError";
import { appointmentRepository } from "../../modules/appointment/appointment.repository";

export const checkRole = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        let appointmentId = req.params.appointmentId;
        if (!appointmentId) {
            const reqBody = req.body;
            if (!reqBody.appointmentId) {
                throw new AppValidationError("appointment is required");
            }
            appointmentId = reqBody.appointmentId;
        }
        const appointment = await appointmentRepository.getAppointmentById(appointmentId);
        if (!appointment) {
            throw new NotFoundError("Appointment not found");
        }
        req.appointment = appointment;
        next();
    } catch (err: any) {
        console.error(`Error getting role.json file: ${err}`);
        throw new DatabaseError("Error retrieving role");
    }
};
