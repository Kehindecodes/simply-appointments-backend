import { Router } from "express";
import { checkUserExists } from "../../middlewares/checkUserExists";
import {
    registerUser,
    loginUser,
    ValidateOTP,
    getUsersWithRole,
    forgotPassword,
    allowPasswordReset,
    resetPassword,
} from "./user.controller";
// import { createService } from '../controller/ServiceController';
const userRouter = Router();

userRouter.post("/", checkUserExists, registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/validate-otp", ValidateOTP);
userRouter.get("/", getUsersWithRole);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);
userRouter.get("/reset-password/:token", allowPasswordReset);

export default userRouter;
