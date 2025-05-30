import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../shared/database/migration/data-source";
import { User } from "../../entity/User";
import bcrypt from "bcrypt";
import { validate } from "class-validator";
import { UserType } from "../../shared/config/enums/userTypes.enum";
import passport from "passport";
import { generateOTP, sendOTP } from "../../shared/utils/otp.utils";
import { CustomRequest } from "../../shared/types/custom-express";
import { OTP } from "../../entity/OTP";
import jwt from "jsonwebtoken";
import { LessThan, MoreThan } from "typeorm";
import moment from "moment-timezone";
import { Role } from "../../entity/Role";
import {
    sendPasswordResetLink,
} from "../../shared/utils/token.utils";
import { LinkToken } from "../../entity/Token";

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

        // add role based on user type
        const role = await AppDataSource.manager.findOneBy(Role, {
            name: user.userType,
        });


        if (!role) {
            res.status(400).json({ message: "role not found" });
            return;
        }

        user.role = role || undefined;

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

    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Get the database timezone from the connection options
    const dbTimezone = (AppDataSource.options.extra as any)?.timezone || "UTC";

    // Calculate 5 minutes ago in the database's timezone
    const fiveMinutesAgo = moment()
        .tz(dbTimezone)
        .subtract(5, "minutes")
        .toDate();
    try {
        // find the latest unexpired OTP for the email
        const otpData = await AppDataSource.manager.findOne(OTP, {
            where: {
                email,
                createdAt: LessThan(fiveMinutesAgo),
            },
            order: { createdAt: "DESC" },
        });

        if (!otpData) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        const DbOtp = otpData.getOtp;

        const user = await AppDataSource.manager.findOneBy(User, { email });

        if (user) {
            if (otp === DbOtp) {
                // Generate JWT token
                const token = jwt.sign(
                    { id: user.userId },
                    process.env.SECRET_KEY as string,
                    {
                        algorithm: "HS256",
                        //  expiresIn: "1h",
                    }
                );
                res.header("Authorization", `Bearer ${token}`);
                return res
                    .status(200)
                    .json({ message: "OTP validated successfully" });
            }
            return res.status(400).json({ message: "Invalid OTP" });
        }
        return res.status(404).json({ message: "No user found" });
    } catch (err: any) {
        res.status(500).send({
            message: "Error validating OTP",
        });
    }
};

export const getUsersWithRole = async (
    req: Request,
    res: Response
): Promise<void> => {
     const {userType} = req.query
    try {
        if(userType){
            if(userType !== UserType.ADMIN && userType !== UserType.CUSTOMER && userType !== UserType.STAFF){
                res.status(400).json({ message: "Invalid user type" });
                return;
            }
        const users = await AppDataSource.getRepository(User)
            .createQueryBuilder("user")
            .leftJoinAndSelect("user.role", "role")
            .where("user.userType = :userType", { userType: userType })
            .getMany();

        res.status(200).json(users);
        }
        else{
            const users = await AppDataSource.getRepository(User)
            .createQueryBuilder("user")
            .leftJoinAndSelect("user.role", "role")
            .getMany();

        res.status(200).json(users);
        }
    } catch (err: any) {
        res.status(500).send({
            message: "Error getting users",
            error: err.message,
        });
    }
};

export const getUserWithRole = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const user = await AppDataSource.getRepository(User)
            .createQueryBuilder("user")
            .where("user.id = :id", { id: req.params.id })
            .leftJoinAndSelect("user.role", "role")
            .getOne();

            if (!user) {
            res.status(404).send({
                message: "User not found",
            });
            return;
        }
        res.status(200).json(user);
    } catch (err: any) {
        res.status(500).send({
            message: "Error getting user",
            error: err.message,
        });
    }
};
export const forgotPassword = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ message: "Email is required" });
        return;
    }
    try {
        await sendPasswordResetLink(email);
        res.status(200).json({
            message: "Reset password link sent successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error sending reset password link",
            error: error,
        });
    }
};

export const allowPasswordReset = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { token } = req.params;
    try {
        const storedToken = await AppDataSource.manager.findOne(LinkToken, {
            where: { token },
        });
        if (!storedToken) {
            res.status(401).json({
                message: "Invalid or expired token. Please request a new token",
            });
        }
        res.status(200).json({ message: "Enter new password" });
    } catch (err: any) {
        res.status(500).send({
            message: err.message,
            error: err,
        });
    }
};

export const resetPassword = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const { password, confirmPassword, email } = req.body;
    if (!password || !confirmPassword || !email) {
        return res.status(400).json({ message: "All fields are required" });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }
    try{
        const user = await AppDataSource.manager.findOne(User, {
            where: { email },
        });
        if (!user) {
            return res.status(400).json({ message: "wrong email" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedUser = await AppDataSource.manager.update(
            User,
            { email },
            { password: hashedPassword }
        );
        return res.status(200).json({
            message: "Password reset successfully",
            updatedUser: updatedUser,
        });
    }catch(err: any){
        return res.status(500).json({
            message: err.message,
            error: 'Error resetting password',
        });
    }

};

export const deleteUser = async (
    req: CustomRequest,
    res: Response
): Promise<void> => {
    try {
        await AppDataSource.manager.remove(req.user);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (err: any) {
        res.status(500).send({
            message: "Error deleting user",
            error: err.message,
        });
    }
};


export const updateUserRole = async ( req: CustomRequest, res: Response) : Promise<void> => {
     const {user, role} = req
    try{
        user.updateUserType = role?.name;
        user.updateRole = role;
        await AppDataSource.manager.save(user)
        res.status(200).json({message: "User updated successfully"});
    }catch(err: any){
        res.status(500).send({
            message: "Error updating user",
            error: err.message,
        });
    }
}