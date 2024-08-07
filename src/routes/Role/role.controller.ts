import { Request, Response } from "express";
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
        if (!role.name) {
            res.status(400).json({ message: "Role name is required" });
        }
        await AppDataSource.manager.save(role);
        res.status(201).json(role);
    } catch (err: any) {
        console.error(`Error creating role:`, err);
        res.status(500).json({ message: "Error creating role" });
    }
};

export const getRoles = async (req: Request, res: Response): Promise<void> => {
    try {
        let data = [];
        const roles = await AppDataSource.manager.find(Role);
        for (const role of roles) {
            data.push(role);
        }
        res.status(200).json(data);
    } catch (err: any) {
        res.status(500).send({
            message: "Error creating role",
            error: err.message,
        });

    }
};

export const getRole = async (
    req: CustomRequest,
    res: Response
): Promise<void> => {
    try {
        // get role from the request
        const role = req.role;
        if (!role) {
            res.status(404).json({ message: "Role not found" });
            return;
        }
        res.status(200).json(role);
    } catch (err: any) {
        res.status(500).send({
            message: "Error getting role",
            error: err.message,
        });
    }
};

export const deleteRole = async (
    req: CustomRequest,
    res: Response
): Promise<void> => {
    try{
        const role = req.role;
        await AppDataSource.manager.remove(role);
        res.status(200);
    } catch (err: any) {
        res.status(500).send({
            message: "Error deleting role",
            error: err.message,
        });
    }
};
