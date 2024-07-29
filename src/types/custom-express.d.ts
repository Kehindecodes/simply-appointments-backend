import { Request } from "express";
import { Role } from "../entity/Role";
import { Service } from "../entity/Service";

export interface CustomRequest extends Request {
    role?: Role;
    user?: User;
    // token?: string;
    // permissions?: string[];
    service?: Service;
    appointment?: Appointment;
}
