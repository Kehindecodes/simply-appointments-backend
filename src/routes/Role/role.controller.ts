import {Request, Response} from "express"
import { Role } from "../../entity/Role";
import { AppDataSource } from "../../migration/data-source";
import { CustomRequest } from "../../types/custom-express";


export const createRole = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const role = new Role();
        role.name = req.body.name;
        if(!role.name) {
            res.status(400).send("name is required");
            return;
        }
        await AppDataSource.manager.save(role);
        res.status(201).json(role);
    } catch (err: any) {
        console.error(`Error creating role: ${err}`);
        res.status(500).send({
            message: "Error creating role",
            error: err.message,
        });
    }
}

export const getRoles = async ( req: Request, res: Response ) : Promise<void> => {
    try{
        let data = [];
        const roles = await AppDataSource.manager.find(Role);
        for (const role of roles) {
            data.push(role);
        }
        res.status(200).json(data);
    } catch (err: any) {
        console.error(`Error getting role.json file: ${err}`);
        res.status(500).send({
            message: "Error creating roles",
            error: err.message,
        });
    }
}

export const getRole = async ( req: CustomRequest, res: Response ) : Promise<void> => {
    try{
        // get role from the request
        const role = req.role
        if (!role) {
            res.status(404).json({ message: "Role not found" });
            return;
        }
        res.status(200).json(role);
    } catch (err: any) {
        console.error(`Error getting role.json file: ${err}`);
        res.status(500).send({
            message: "Error getting roles",
            error: err.message,
        });
    }

}

export const deleteRole = async ( req: Request, res: Response ) : Promise<void> => {
    try{
        const role = await AppDataSource.manager.findOneBy(Role, {id: Number(req.params.id)});
        if (!role) {
            res.status(404).json({ message: "Role not found" });
            return;
        }
        await AppDataSource.manager.remove(role);
        res.status(200);
    } catch (err: any) {
        console.error(`Error getting role.json file: ${err}`);
        res.status(500).send({
            message: "Error creating roles",
            error: err.message,
        });
    }
}