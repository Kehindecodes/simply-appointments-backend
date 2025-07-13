import { Router } from "express";
import { checkUserExists } from "../../shared/middlewares/checkUserExists";
import { authController } from "./auth.controller";
import { asyncHandler } from "../../shared/utils/asyncHandler";

const authRouter = Router();

authRouter.post("/", checkUserExists, asyncHandler(authController.registerUser));
authRouter.post("/login", asyncHandler(authController.loginUser));
authRouter.post("/validate-otp", asyncHandler(authController.validateOTP));
authRouter.post("/forgot-password", asyncHandler(authController.forgotPassword));
authRouter.post("/reset-password", asyncHandler(authController.resetPassword));
authRouter.get("/reset-password/:token", asyncHandler(authController.allowPasswordReset));

export default authRouter;
