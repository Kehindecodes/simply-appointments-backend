import { Request, Response } from "express";
import { AppDataSource } from "../../migration/data-source";
import { User } from "../../entity/User";
import bcrypt from "bcrypt";
import { validate } from "class-validator";

export const registerUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { name, email, phoneNumber, password, address, userType } =
            req.body;

        // Create user instance
        const user = new User();
        user.name = name;
        user.email = email;
        user.phoneNumber = phoneNumber;
        user.password = password;
        user.address = address;
        user.userType = userType;

        // Validate the user instance
        const errors = await validate(user);

        if (errors.length > 0) {
            // If there are validation errors, return the first error message
            const errorMessage = errors[0].constraints
                ? Object.values(errors[0].constraints)[0]
                : "Validation error";
            res.status(400).json({ message: errorMessage });
            return;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // save user to database
        const savedUser = await AppDataSource.manager.save(user);
        res.status(201).json(savedUser);
    } catch (err: any) {
        console.error(`Error creating user: ${err}`);
        res.status(500).send({
            message: "Error creating user",
            error: err.message,
        });
    }
};
