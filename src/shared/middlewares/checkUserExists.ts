import {Request, Response, NextFunction} from "express";
import { CustomRequest } from "../types/custom-express";
import { userRepository } from "../../modules/user/user.repository";


export const checkUserExists = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try{
        const email = req.body.email
        if(!email) {
            res.status(400).json({message: "Email is required"})
            return;
        }
        const user = await userRepository.getUserByEmail(email);
        if (user) {
            res.status(400).json({message: "User with this email already exists"});
            return;
        }
        next();
    } catch (err: any) {
        console.error(`Error checking user existence: ${err}`);
        res.status(500).json({message: "Error checking user existence"});
    }
}