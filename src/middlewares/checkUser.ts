import {Request, Response, NextFunction} from "express";
import { AppDataSource } from "../migration/data-source";
import { CustomRequest } from "../types/custom-express";
import { User } from "../entity/User";

export const checkUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try{
        // check if user exists in the route
        let userId = req.params.id;
        // check the request body 
        if (!userId) {
           const reqBody = req.body
           if(!reqBody.userId) {
            res.status(400).json({message: "User not found"});
            return;
           }
           userId = reqBody.userId;
        }
        const user = await AppDataSource.manager.findOneBy(User, {id: userId});
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // set the user in the request
        req.user = user;
        next();
    } catch (err: any) {
        console.error(`Error getting user.json file: ${err}`);
        res.status(500).send({
            message: "Error creating users",
            error: err.message,
        });
    }
}