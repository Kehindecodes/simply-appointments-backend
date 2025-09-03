import express, { Router } from "express";
import { checkUser } from "../../shared/middlewares/checkUser";
import {userController } from "./user.controller";
import { jwtAuthentication } from "../../shared/middlewares/jwtAuthentication";
import { authorizeUser } from "../../shared/middlewares/authorizeUser";
import { checkStaff } from "../../shared/middlewares/checkStaff";
import { checkService } from "../../shared/middlewares/checkService";
import { asyncHandlerAsyncAwait } from "../../shared/utils/asyncHandlerAsyncAwait";
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
    asyncHandlerAsyncAwait(userController.bookAppointment)
);

userRouter.get("/:id",
    // jwtAuthentication,
    // authorizeUser(["View Users"]),
    checkUser,
    asyncHandlerAsyncAwait(userController.getUser)
)

userRouter.get("/",
    // jwtAuthentication,
    // authorizeUser(["View Users"]),
    asyncHandlerAsyncAwait(userController.getAllUsers)
)

userRouter.patch("/:id",
    jwtAuthentication,
    authorizeUser(["Update user"]),
    checkUser,
    asyncHandlerAsyncAwait(userController.updateUser)
)

userRouter.delete("/:id",
    jwtAuthentication,
    authorizeUser(["delete user"]),
    checkUser,
    asyncHandlerAsyncAwait(userController.deleteUser)
)

userRouter.get("/:id/appointments",
    jwtAuthentication,
    authorizeUser(["View Appointments"]),
    checkUser,
    asyncHandlerAsyncAwait(userController.getUserAppointments)
)

userRouter.get("/:staffId/services/:serviceId",
    jwtAuthentication,
    authorizeUser(["Add Staff Service "]),
    checkService,
    checkStaff,
    asyncHandlerAsyncAwait(userController.addServiceToUser)
)

userRouter.get("/:staffId/services",
    jwtAuthentication,
    authorizeUser(["View Staff Services"]),
    checkStaff,
    asyncHandlerAsyncAwait(userController.getUserServices)
)

userRouter.delete("/:staffId/services/:serviceId",
    jwtAuthentication,
    authorizeUser(["Delete staff service"]),
    checkStaff,
    asyncHandlerAsyncAwait(userController.deleteUserService)
)

export default userRouter;
