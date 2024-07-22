import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../migration/data-source";
import { User } from "../../entity/User";
import bcrypt from "bcrypt";
import { validate } from "class-validator";
import { UserType } from "../../enum/userTypes.enum";
import passport from "passport";
import { generateOTP, sendOTP } from "../../utils/otp.utils";
import { CustomRequest } from "../../types/custom-express";
import { OTP } from "../../entity/OTP";
import jwt from "jsonwebtoken";
import {LessThan, MoreThan } from "typeorm";
import moment from 'moment-timezone';

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
        user.userType = userType || UserType.CUSTOMER;

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

export const loginUser = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                message: "Email and password are required",
            });
            return;
        }
        passport.authenticate(
            "local",
            async (err: any, user: User, info: any) => {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return res.status(401).json({ message: info.message });
                }
                // generate One Time Password
                const otp = generateOTP();
                // save OTP to database
                await AppDataSource.manager.save(OTP, {
                    otp,
                    email,
                });
                const infoMail = await sendOTP(otp, email);
                if (infoMail) {
                    return res.status(200).json({
                        message:
                            "User logged in successfully. Please check your email for OTP",
                    });
                }
                return res.status(500).json({
                    message: "Error sending OTP",
                });
            }
        )(req, res, next);
    } catch (err: any) {
        console.error(`Error logging in user: ${err}`);
        res.status(500).send({
            message: "Error logging in user",
            error: err.message,
        });
    }
};


export const ValidateOTP = async (req: Request, res: Response) => {
    const { email, otp } = req.body;

    // Get the database timezone from the connection options
    const dbTimezone = (AppDataSource.options.extra as any)?.timezone || "UTC";

    // Calculate 5 minutes ago in the database's timezone
    const fiveMinutesAgo = moment().tz(dbTimezone).subtract(5, 'minutes').toDate();

    // find the latest unexpired OTP for the email
    const otpData = await AppDataSource.manager.findOne(OTP, {
        where: { 
            email,
            createdAt: LessThan(fiveMinutesAgo)
        },
        order: { createdAt: 'DESC' }
    });

    if (!otpData) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    const DbOtp = otpData.getOtp;

    const user = await AppDataSource.manager.findOneBy(User, { email });

    if (otp === DbOtp) {
        // Generate JWT token
        const token = jwt.sign({ user }, process.env.SECRET_KEY as string, {
            algorithm: "HS256",
        } );
        res.header("Authorization", `Bearer ${token}`);
        return res.status(200).json({ message: "OTP validated successfully" });
    }

    return res.status(400).json({ message: "Invalid OTP" });
};