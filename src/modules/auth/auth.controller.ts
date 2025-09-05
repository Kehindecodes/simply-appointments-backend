import { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service";
import { CustomRequest } from "../../shared/types/custom-express";

export const authController = {
  registerUser: async (req: CustomRequest, res: Response): Promise<void> => {
    await authService.registerUser(req.body);
    res.status(201).json();
  },
  registerAdmin: async (req: CustomRequest, res: Response): Promise<void> => {
    await authService.registerAdmin(req.body);
    res.status(201).json();
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
    res.status(200).json();
  },
  forgotPassword: async (req: CustomRequest, res: Response): Promise<void> => {
    await authService.forgotPassword(req.body.email);
    res.status(200).json();
  },
  allowPasswordReset: async (
    req: CustomRequest,
    res: Response
  ): Promise<void> => {
    await authService.allowPasswordReset(req.body.token);
    res.status(200).json({message: "You can now reset your password"});
  },
  resetPassword: async (req: CustomRequest, res: Response): Promise<void> => {
    await authService.resetPassword(
      req.body.email,
      req.body.password,
      req.body.confirmPassword
    );
    res.status(200).json({message: "Password reset successfully"});
  },
};
