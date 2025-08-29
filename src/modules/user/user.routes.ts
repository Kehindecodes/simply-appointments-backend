import express, { Router } from "express";
import { checkUser } from "../../shared/middlewares/checkUser";
import {userController } from "./user.controller";
import { jwtAuthentication } from "../../shared/middlewares/jwtAuthentication";
import { authorizeUser } from "../../shared/middlewares/authorizeUser";
import { checkStaff } from "../../shared/middlewares/checkStaff";
import { checkService } from "../../shared/middlewares/checkService";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { passBookingLimit } from "../../shared/middlewares/passBookingLimit";
import { avoidBookingSameServiceMultipleTimes } from "../../shared/middlewares/avoidMultipleServiceBookings";
import { passUserBookingLimit } from "../../shared/middlewares/passUserBookingLimit";
import { preventDoubleBooking } from "../../shared/middlewares/preventDoubleBooking";

const userRouter = express.Router();

userRouter.post("/:id/appointments",
    jwtAuthentication,
    authorizeUser(["Book Appointments"]),
    checkUser,
    checkService,
    checkStaff,
    passBookingLimit,
    avoidBookingSameServiceMultipleTimes,
    passUserBookingLimit,
    preventDoubleBooking,
    asyncHandler(userController.bookAppointment)
);

userRouter.get("/:id",
    jwtAuthentication,
    authorizeUser(["get user"]),
    checkUser,
    asyncHandler(userController.getUser)
)

userRouter.get("/",
    jwtAuthentication,
    authorizeUser(["get user"]),
    asyncHandler(userController.getAllUsers)
)

userRouter.patch("/:id",
    jwtAuthentication,
    authorizeUser(["update user"]),
    checkUser,
    asyncHandler(userController.updateUser)
)

userRouter.delete("/:id",
    jwtAuthentication,
    authorizeUser(["delete user"]),
    checkUser,
    asyncHandler(userController.deleteUser)
)

export default userRouter;
