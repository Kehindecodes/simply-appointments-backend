import { CustomRequest } from "../../shared/types/custom-express";
import { ApiSuccessResponse } from "../../shared/utils/ApiSuccessResponse";
import { appointmentRepository } from "./appointment.repository";
import { appointmentService } from "./appointment.service";
import { Request, Response } from "express";

export const appointmentController = {
   //  bookAppointment: async (req: Request, res: Response) => {
   //          const { time, staffId, serviceId, date } = req.body;
   //          await appointmentService.bookAppointment(time, staffId, serviceId, date);
   //          res.status(201).json(new ApiSuccessResponse(201, "Appointment created successfully"));
   //  },
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
   }
}