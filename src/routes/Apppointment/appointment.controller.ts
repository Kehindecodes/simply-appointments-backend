import { Request, Response } from "express";
import { Appointment } from "../../entity/Appointment";
import { AppointmentStatus } from "../../enum/AppointmentStatus";
import { validate, Validate, Validator } from "class-validator";
import { AppDataSource } from "../../migration/data-source";
import { ResponseStatus } from "../../model/response-status";
import { errorHandler } from "../../httpResponse-handler/errorHandler";
import { CustomRequest } from "../../types/custom-express";
import { Service } from "../../entity/Service";
import { User } from "../../entity/User";
import { checkIfStillInOpenHours } from "../../utils/checkIfStillInOpenHours";
import { getAvailableStaffId } from "../../utils/getAvailableStaffId";
import { sendBookingConfirmation } from "../../utils/notification.utils";

export const bookAppointment = async (req: CustomRequest, res: Response) => {
    try {
        const { time, staffId: requestedStaffId, serviceId, date } = req.body;

        // create appointment instance
        const appointment = new Appointment();
        appointment.userId = req.user.id;
        appointment.staffId = requestedStaffId;
        appointment.serviceId = serviceId;
        appointment.date = date;
        appointment.status = AppointmentStatus.PENDING;

        // Convert date and time to a single Date object
        const [hours, minutes] =  time?.split(":");
        const appointmentDateTime = new Date(date);
        appointmentDateTime.setHours(
            parseInt(hours, 10),
            parseInt(minutes, 10),
            0,
            0
        );

        const options: Intl.DateTimeFormatOptions = {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        };
        appointment.time = appointmentDateTime.toLocaleTimeString(
            "en-US",
            options
        );
        // Validate the appointment instance
        const errors = await validate(appointment);

        if (errors.length > 0) {
            // If there are validation errors, return the first error message
            const errorMessage = errors[0].constraints
                ? Object.values(errors[0].constraints)[0]
                : "Validation error";
            res.status(400).json({ message: errorMessage });
            return;
        }


        if (!checkIfStillInOpenHours(appointmentDateTime)) {
            return res.status(400).json({
                message: "Appointment time is not in open hours",
            });
        }

        const assignedStaffId = await getAvailableStaffId(
            requestedStaffId,
            serviceId,
            appointmentDateTime
        );
        if (!assignedStaffId) {
            const staff = await AppDataSource.manager.findOne(User, {
                where: { id: requestedStaffId },
            });
            return res.status(400).json({
                message: `${staff?.name} is not available at ${time} on ${date}`,
            });
        }

        // assign staff to the appointment
        if (typeof assignedStaffId === "string") {
            appointment.staffId = assignedStaffId;
        } else {
            return res.status(400).json({
                message: "Invalid staff assignment",
            });
        }

        const service = await AppDataSource.manager.findOne(Service, {
            where: { id: serviceId },
        });
        const duration = service?.duration;

        if (duration) {
            appointmentDateTime.setMinutes(
                appointmentDateTime.getMinutes() + Number(duration)
            );
        }

        appointment.endTime = appointmentDateTime.toLocaleTimeString(
            "en-US",
            options
        );

        await AppDataSource.manager.save(appointment);

        res.status(201).json({
            message: "Appointment created successfully",
        });
        // send booking confirmation to the user
        const user = await AppDataSource.manager.findOne(User, {
            where: { id: req.user.id },
        });
        const staff = await AppDataSource.manager.findOne(User, {
            where: { id: assignedStaffId },
        });
        sendBookingConfirmation(
            user?.name ?? "",
            date,
            time,
            service?.serviceName ?? "",
            staff?.name ?? "",
            user?.email ?? ""
        );
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
