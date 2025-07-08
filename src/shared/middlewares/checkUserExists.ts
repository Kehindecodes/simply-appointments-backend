import {Request, Response, NextFunction} from "express";
import { CustomRequest } from "../types/custom-express";
import { userRepository } from "../../modules/user/user.repository";
import { ApiErrorResponse } from "../utils/ApiErrorResponse";


export const checkUserExists = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try{
        const email = req.body.email
        if(!email) {
            throw new ApiErrorResponse(400, "Email is required");
        }
        const user = await userRepository.getUserByEmail(email);
        if (user) {
            throw new ApiErrorResponse(400, "User with this email already exists");
        }
        next();
    } catch (err: any) {
        console.error(`Error checking user existence: ${err}`);
        throw new ApiErrorResponse(500, "Error checking user existence");
    }
}