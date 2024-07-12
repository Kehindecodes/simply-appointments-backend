import {Request, Response, NextFunction} from "express";
import { AppDataSource } from "../migration/data-source";
import { CustomRequest } from "../types/custom-express";
import { User } from "../entity/User";


export const checkUserExists = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try{
        const email = req.body.email
        if(!email) {
            res.status(400).json({message: "email is required"});
            return;
        }
        const user = await AppDataSource.manager.findOneBy(User, {email: email});
        if (user) {
            res.status(404).json({ message: "User already exists" });
            return;
        }
        next();
    } catch (err: any) {
        console.error(`Error getting user.json file: ${err}`);
        res.status(500).send({
            message: "Error creating users",
            error: err.message,
        });
    }
}