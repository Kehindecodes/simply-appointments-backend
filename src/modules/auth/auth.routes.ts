import { Router } from "express";
import { checkUserExists } from "../../shared/middlewares/checkUserExists";
import { authController } from "./auth.controller";
import { asyncHandlerAsyncAwait } from "../../shared/utils/asyncHandlerAsyncAwait";

const authRouter = Router();

authRouter.post("/register", checkUserExists, asyncHandlerAsyncAwait(authController.registerUser));
authRouter.post("/register/admin", checkUserExists, asyncHandlerAsyncAwait(authController.registerAdmin));
authRouter.post("/login", asyncHandlerAsyncAwait(authController.loginUser));
authRouter.post("/validate-otp", asyncHandlerAsyncAwait(authController.validateOTP));
authRouter.post("/forgot-password", asyncHandlerAsyncAwait(authController.forgotPassword));
authRouter.post("/reset-password", asyncHandlerAsyncAwait(authController.resetPassword));
authRouter.get("/reset-password/:token", asyncHandlerAsyncAwait(authController.allowPasswordReset));

export default authRouter;
