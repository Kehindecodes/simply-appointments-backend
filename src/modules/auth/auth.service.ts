import passport from "passport";
import { UserType } from "../../shared/config/enums/userTypes.enum";
import { User } from "../../shared/database/entity/User";
import { ApiErrorResponse } from "../../shared/utils/ApiErrorResponse";
import { ApiSuccessResponse } from "../../shared/utils/ApiSuccessResponse";
import { repository} from "../../shared/utils/repository";
import { validateEntity } from "../../shared/utils/validateData";
import { roleRepository } from "../role/role.repository";
import bcrypt from "bcrypt";
import { generateOTP, sendOTP } from "../../shared/utils/otp.utils";
import { OTP } from "../../shared/database/entity/OTP";
import { NextFunction, Request, Response } from "express";

interface UserData {
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    address: string;
    userType: string;
}

export const authService = {
    registerUser: async (userData: UserData): Promise<ApiSuccessResponse> => {
        const { name, email, phoneNumber, password, address, userType } = userData;

        const user = new User();
        user.name = name;
        user.email = email;
        user.phoneNumber = phoneNumber;
        user.password = password;
        user.address = address;
        user.userType = userType || UserType.CUSTOMER;

        await validateEntity(user);

        const role = await roleRepository.getRoleByUserType(userType || UserType.CUSTOMER);

        if (!role) {
            throw new ApiErrorResponse(400, "role not found");
        }
        user.role = role || undefined;

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await repository.save(user);
        return new ApiSuccessResponse(201, "");
    },

     loginUser : async (email: string, password: string, req: Request, res: Response, next: NextFunction): Promise<ApiSuccessResponse> => {

                  if (!email || !password) {
                      throw new ApiErrorResponse(400, "Email and password are required");
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
                          await repository.save(OTP, {
                              otp,
                              email,
                          });
                          const infoMail = await sendOTP(otp, email);
                          if (!infoMail) {
                              return reject(new ApiErrorResponse(500, "Error sending OTP"));
                          }
                          return resolve(new ApiSuccessResponse(200, "User logged in successfully. Please check your email for OTP"));
                      }
                  )(req, res, next);
                  });
     }
}