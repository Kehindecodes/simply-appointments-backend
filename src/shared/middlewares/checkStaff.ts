import {Request, Response, NextFunction} from "express";
import { AppDataSource } from "../database/migration/data-source";
import { CustomRequest } from "../types/custom-express";
import { User } from "../database/entity/User";
import { UserType } from "../config/enums/UserType";
import { ApiErrorResponse } from "../utils/ApiErrorResponse";

export const checkStaff = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try{
        // check if user exists in the route
        let staffId = req.params.id;
        // check the request body
        if (!staffId) {
           const reqBody = req.body
           if(!reqBody.staffId) {
            res.status(400).json(new ApiErrorResponse(400, "Staff id is required"));
            return;
           }
           staffId = reqBody.staffId;
        }
        const user = await AppDataSource.manager.findOneBy(User, {id: staffId, userType: UserType.STAFF});
        if (!user) {
            res.status(404).json(new ApiErrorResponse(404, "Staff not found"));
            return;
        }
        // set the user in the request
        req.staff = user;
        next();
    } catch (err: any) {
        console.error(`Error validating staff: ${err}`);
        res.status(500).send(new ApiErrorResponse(500, "Error validating staff"));
    }
}