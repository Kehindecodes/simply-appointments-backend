import { Router } from "express";
import { addServiceToUser, getUsersService } from "./userService.controller";
import { checkUserService } from "../../shared/middlewares/checkUserService";
import { checkUser } from "../../shared/middlewares/checkUser";
import { checkService } from "../../shared/middlewares/checkService";

export const userServiceRouter = Router();

userServiceRouter.post(
    "/user/:userId/service/:serviceId",
    checkUser,
    checkService,
    addServiceToUser
);
userServiceRouter.get(
    "/user/:userId/service/:serviceId",
    checkUserService,
    getUsersService
);

export default userServiceRouter;
