import { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service";
import { ApiSuccessResponse } from "../../shared/utils/ApiSuccessResponse";
import { CustomRequest } from "../../shared/types/custom-express";

export const authController = {
  registerUser: async (req: CustomRequest, res: Response): Promise<void> => {
    await authService.registerUser(req.body);
    res.json(new ApiSuccessResponse(201, "User registered successfully"));
  },
  loginUser: async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    await authService.loginUser(
      req.body.email,
      req.body.password,
      req,
      res,
      next
    );
  },
  validateOTP: async (req: CustomRequest, res: Response): Promise<void> => {
    await authService.validateOTP(req.body.email, req.body.otp, res);
    res.json(new ApiSuccessResponse(200, "OTP validated successfully"));
  },
  forgotPassword: async (req: CustomRequest, res: Response): Promise<void> => {
    await authService.forgotPassword(req.body.email);
    res.json(
      new ApiSuccessResponse(200, "Password reset link sent successfully")
    );
  },
  allowPasswordReset: async (
    req: CustomRequest,
    res: Response
  ): Promise<void> => {
    await authService.allowPasswordReset(req.body.token);
    res.json(new ApiSuccessResponse(200, ""));
  },
  resetPassword: async (req: CustomRequest, res: Response): Promise<void> => {
    await authService.resetPassword(
      req.body.email,
      req.body.password,
      req.body.confirmPassword
    );
    res.json(new ApiSuccessResponse(200, "Password reset successfully"));
  },
};
