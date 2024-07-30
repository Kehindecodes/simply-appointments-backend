import { Request, Response } from "express";
import { Appointment } from "../../entity/Appointment";
import { Status } from "../../enum/Status";
import { validate, Validate, Validator } from "class-validator";
import { AppDataSource } from "../../migration/data-source";
import { ResponseStatus } from "../../model/response-status";

export const createAppointment = async (req: Request, res: Response) => {
    try {
        const { userId, time, staffId, serviceId } = req.body;

        const appointment = new Appointment();
        appointment.userId = userId;
        appointment.time = time;
        appointment.staffId = staffId;
        appointment.serviceId = serviceId;
        appointment.status = Status.PENDING;

        const errors = await validate(appointment);
        if (errors.length > 0) {
            // If there are validation errors, return the first error message
            const errorMessage = errors[0].constraints
                ? Object.values(errors[0].constraints)[0]
                : "Validation error";
            res.status(400).json({ message: errorMessage });
            return;
        }
        await AppDataSource.manager.save(appointment);
        res.json({
            message: "Appointment created successfully",
            success: true,
            status: ResponseStatus.SUCCESS,
        });
    } catch (error) {
        res.json(errorHandler(error, res));
    }
};

export const getAppointment = async (req: Request, res: Response) => {
    try {
        const appointment = await AppDataSource.manager.findOne(Appointment, {
            where: { id: req.params.id },
        });
        if (!appointment) {
            res.json(ResponseStatus.NOT_FOUND);
        }
        res.status(200).json(appointment!.data());
    } catch (error) {
        res.json(errorHandler(error, res));
    }
};

export const getAppointments = async (req: Request, res: Response) => {
    try {
        const appointment = await AppDataSource.manager.find(Appointment, {
            order: { createdAt: "DESC" },
            take: 10,
        });
        if (!appointment) {
            res.json(ResponseStatus.NOT_FOUND);
        }
        res.status(200).json({
            totalRecords: appointment.length,
            data: appointment,
        });
        return;
    } catch (error) {
        console.error(error);
    }
};

export const deleteAppointment = async (req: Request, res: Response) => {
    try {
        // delete a service
        const appointment = await AppDataSource.getRepository(
            Appointment
        ).findOneBy({
            id: req.params.id,
        });
        await AppDataSource.manager.remove(appointment!);
        res.json({
            success: true,
            status: 200,
            message: "appointment deleted successfully",
        });
    } catch (error) {
        res.json({
            message: error,
            status: 500,
        });
    }
};
