import express from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { appointmentController } from "./appointment.controller";

const appointmentRouter = express.Router();

// appointmentRouter.post("/:id", asyncHandler(appointmentController.bookAppointment));
appointmentRouter.get("/:id", asyncHandler(appointmentController.getAppointment));
appointmentRouter.get("/", asyncHandler(appointmentController.getAllAppointments));
appointmentRouter.delete("/:id", asyncHandler(appointmentController.deleteAppointment));

export default appointmentRouter;

