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
    deleteUser,
    updateUserRole,
} from "./user.controller";
import { checkUser } from "../../middlewares/checkUser";
import { jwtAuthentication } from "../../middlewares/jwtAuthentication";
import { authorizeUser } from "../../middlewares/authorizeUser";
import { checkRole } from "../../middlewares/checkRole";
const userRouter = Router();

userRouter.post("/", checkUserExists, registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/validate-otp", ValidateOTP);
userRouter.get("/", getUsersWithRole);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);
userRouter.get("/reset-password/:token", allowPasswordReset);
userRouter.delete(
    "/:id",
    jwtAuthentication,
    authorizeUser(["delete user"]),
    checkUser,
    deleteUser
);
userRouter.patch(
    "/:id/role/:roleId",
    jwtAuthentication,
    authorizeUser(["Update user role"]),
    checkUser,
    checkRole,
    updateUserRole
);

export default userRouter;
