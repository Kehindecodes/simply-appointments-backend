import express from "express";
import { asyncHandlerAsyncAwait } from "../../shared/utils/asyncHandlerAsyncAwait";
import { appointmentController } from "./appointment.controller";

const appointmentRouter = express.Router();

// appointmentRouter.post("/:id", asyncHandlerAsyncAwait(appointmentController.bookAppointment));
appointmentRouter.get("/:id", asyncHandlerAsyncAwait(appointmentController.getAppointment));
appointmentRouter.get("/", asyncHandlerAsyncAwait(appointmentController.getAllAppointments));
appointmentRouter.delete("/:id", asyncHandlerAsyncAwait(appointmentController.deleteAppointment));

export default appointmentRouter;

