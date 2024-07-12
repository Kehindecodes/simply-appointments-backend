import {Request, Response, NextFunction} from "express";
import { Role } from "../entity/Role";
import { AppDataSource } from "../migration/data-source";
import { CustomRequest } from "../types/custom-express";


export const checkRole = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try{
        // check if role exists in the route
        let roleId = Number(req.params.id);
        // check the request body 
        if (!roleId) {
           const reqBody = req.body
           if(!reqBody.roleId) {
            res.status(400).json({message: "role is required"});
            return;
           }
           roleId = Number(reqBody.roleId);
        }
        const role = await AppDataSource.manager.findOneBy(Role, {id: roleId});
        if (!role) {
            res.status(404).json({ message: "Role not found" });
            return;
        }
        // set the role in the request
        req.role = role;
        next();
    } catch (err: any) {
        console.error(`Error getting role.json file: ${err}`);
        res.status(500).send({
            message: "Error creating roles",
            error: err.message,
        });
    }
}