import passport from "passport";
import { UserType } from "../../shared/config/enums/UserType";
import { User } from "../../shared/database/entity/User";
import { ApiErrorResponse } from "../../shared/utils/ApiErrorResponse";
import { repository} from "../../shared/utils/repository";
import { validateEntity } from "../../shared/utils/validateData";
import { roleRepository } from "../role/role.repository";
import bcrypt from "bcrypt";
import { generateOTP, sendOTP } from "../../shared/utils/otp.utils";
import { OTP } from "../../shared/database/entity/OTP";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { userRepository } from "../user/user.repository";
import { sendPasswordResetLink } from "../../shared/utils/token.utils";
import { linkTokenRepository } from "../link-token";
import { otpRepository } from "../otp";
import { NotFoundError } from "../../errors/NotFoundError";
import { AppValidationError } from "../../errors/AppValidationError";
import { OtpError } from "../../errors/OtpError";

interface UserData {
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    address: string;
    userType: UserType;
}

export const authService = {
    registerUser: async (userData: UserData): Promise<void> => {
        const { name, email, phoneNumber, password, address, userType } = userData;

        const user = new User();
        user.name = name;
        user.email = email;
        user.phoneNumber = phoneNumber;
        user.password = password;
        user.address = address;
        user.userType = userType || UserType.CUSTOMER;

        await validateEntity(user);

        const role = await roleRepository.getRoleByName(userType || UserType.CUSTOMER);

        if (!role) {
            throw new NotFoundError("role not found");
        }
        user.role = role || undefined;

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await repository.save(user);
    },

     loginUser : async (
        email: string,
        password: string,
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {

                  if (!email || !password) {
                      throw new AppValidationError("Email and password are required");
                  }
                  return new Promise((resolve, reject) => {
                  passport.authenticate(
                      "local",
                      async (err: any, user: User, info: any) => {
                          if (err) {
                              return reject(new ApiErrorResponse(500, err.message));
                          }
                          if (!user) {
                              return reject(new ApiErrorResponse(401, info.message));
                          }
                          const otp = generateOTP();
                          if (!otp) {
                              return reject(new ApiErrorResponse(500, "Error generating OTP"));
                          }
                          const otpEntity = new OTP();
                          otpEntity.otp = otp;
                          otpEntity.email = email;
                          await repository.save(otpEntity);
                          const infoMail = await sendOTP(otp, email);
                          if (!infoMail) {
                              return reject(new OtpError("Error sending OTP"));
                          }
                          return resolve();
                      }
                  )(req, res, next);
                  });
     },

    validateOTP : async (email: string, otp: string, res: Response): Promise<void> => {
            if (!email || !otp) {
                throw new AppValidationError("Email and OTP are required");
            }

                const otpData = await otpRepository.getLatestOtp(email);

                if (!otpData) {
                    throw new AppValidationError("Invalid OTP");
                }

                const DbOtp = otpData.getOtp;

                const user = await userRepository.getUserByEmail(email);

                if (user) {
                    if (otp === DbOtp) {
                        const token = jwt.sign(
                            { id: user.id },
                            process.env.SECRET_KEY as string,
                            {
                                algorithm: "HS256",
                                expiresIn: "1h",
                            }
                        );
                        res.header("Authorization", `Bearer ${token}`);
                        return;
                    }
                    throw new AppValidationError("Invalid OTP");
                }
                throw new NotFoundError("No user found");


    },
    forgotPassword : async (
        email: string,
    ): Promise<void> => {
        if (!email) {
            throw new AppValidationError("Email is required");
        }
            await sendPasswordResetLink(email);
            return;
    },

    allowPasswordReset : async (
        token: string,
    ): Promise<void> => {
            const storedToken = await linkTokenRepository.validateToken(token);
            if (!storedToken) {
                throw new AppValidationError("Invalid or expired token. Please request a new token");
            }
            return;
    },

    resetPassword : async (
        email: string,
        password: string,
        confirmPassword: string,
    ): Promise<void> => {
        if (!password || !confirmPassword || !email) {
            throw new AppValidationError("All fields are required");
        }
        if (password !== confirmPassword) {
            throw new AppValidationError("Passwords do not match");
        }
            const user = await userRepository.getUserByEmail(email);
            if (!user) {
                throw new AppValidationError("wrong email");
            }
            if (!user.password) {
                throw new AppValidationError("No password set for this account");
            }

            const isSamePassword = await bcrypt.compare(password, user.password);
            if (isSamePassword) {
            throw new AppValidationError("New password cannot be the same as current password");
        }
            const hashedPassword = await bcrypt.hash(password, 10);
            await userRepository.updateUserPassword(email, hashedPassword);
            return;
    },
}
