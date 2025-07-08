import { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service";
import { ApiSuccessResponse } from "../../shared/utils/ApiSuccessResponse";



export const authController = {

    registerUser:  async (req: Request, res: Response): Promise<void> => {
              await authService.registerUser(req.body);
              res.json(new ApiSuccessResponse(201, "User registered successfully"));
    },
    loginUser: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        await authService.loginUser(req.body.email, req.body.password, req, res, next);
    },
    validateOTP: async (req: Request, res: Response): Promise<void> => {
        await authService.validateOTP(req.body.email, req.body.otp,res);
    }
}