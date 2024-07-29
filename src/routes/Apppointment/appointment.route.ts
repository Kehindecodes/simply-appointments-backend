import { Router } from "express";
import {
    createAppointment,
    deleteAppointment,
    getAppointment,
    getAppointments,
} from "./appointment.controller";
import { checkAppointment } from "../../middlewares/checkAppointment";

export const appointmentRouter = Router() as Router;
appointmentRouter.post("/:id", checkAppointment, createAppointment);
appointmentRouter.get("/:id", checkAppointment, getAppointment);
appointmentRouter.get("/", getAppointments);
appointmentRouter.delete("/:id", checkAppointment, deleteAppointment);
