import { Router } from "express";
import { checkUserExists } from "../../shared/middlewares/checkUserExists";
import { authController } from "./auth.controller";
import { asyncHandler } from "../../shared/utils/asyncHandler";

const authRouter = Router();

authRouter.post("/", checkUserExists, asyncHandler(authController.registerUser));
authRouter.post("/login", asyncHandler(authController.loginUser));

export default authRouter;
