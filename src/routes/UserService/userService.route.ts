import { Router } from "express";
import { addServiceToUser } from "./userService.controller";

export const userServiceRouter = Router();

userServiceRouter.post("/service:userId:serviceId", addServiceToUser);
