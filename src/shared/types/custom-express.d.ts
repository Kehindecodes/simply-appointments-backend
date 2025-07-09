import { Request } from "express";
import { Role } from "../database/entity/Role";
import { User } from "../database/entity/User";
import { Service } from "../database/entity/Service";


export interface CustomRequest extends Request {
    role?: Role;
    user?: User;
    userId?: string;
    // token?: string;
    // permissions?: string[];
    service?: Service;
}
