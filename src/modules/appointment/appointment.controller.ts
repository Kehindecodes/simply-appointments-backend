import { CustomRequest } from "../../shared/types/custom-express";
import { ApiSuccessResponse } from "../../shared/utils/ApiSuccessResponse";
import { appointmentRepository } from "./appointment.repository";
import { appointmentService } from "./appointment.service";
import { Request, Response } from "express";

export const appointmentController = {
    bookAppointment: async (req: CustomRequest, res: Response) => {
            await appointmentService.bookAppointment(req);
            res.status(201).json(new ApiSuccessResponse(201, "Appointment created successfully"));
    },
    getAppointment: async (req: CustomRequest, res: Response) => {
       const appointment = req.appointment;
       res.status(200).json(new ApiSuccessResponse(200, "", appointment));
    },

   getAllAppointments: async (req: Request, res: Response) => {
    const appointments = await appointmentRepository.getAppointments();
    res.status(200).json(new ApiSuccessResponse(200, "", appointments));
   },

   deleteAppointment: async (req: CustomRequest, res: Response) => {
    const appointment = req.appointment;
    await appointmentRepository.deleteAppointment(appointment!);
    res.status(200).json(new ApiSuccessResponse(200, "", appointment));
   },

   updateAppointment: async (req: CustomRequest, res: Response) => {
    const appointment = req.appointment;
    const { time, staffId, serviceId } = req.body;
    appointment!.time = time;
    appointment!.staffId = staffId;
    appointment!.serviceId = serviceId;
    await appointmentRepository.updateAppointment(appointment!);
    res.status(200).json(new ApiSuccessResponse(200, "", appointment));
   }
}