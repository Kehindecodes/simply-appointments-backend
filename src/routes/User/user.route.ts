// import { Router } from "express";
// import { checkUserExists } from "../../shared/middlewares/checkUserExists";
// import {
//     getUsersWithRole,
//     deleteUser,
//     updateUserRole,
// } from "./user.controller";
// import { checkUser } from "../../shared/middlewares/checkUser";
// import { jwtAuthentication } from "../../shared/middlewares/jwtAuthentication";
// import { authorizeUser } from "../../shared/middlewares/authorizeUser";
// import { checkRole } from "../../shared/middlewares/checkRole";
// import { bookAppointment } from "../Apppointment/appointment.controller";
// import { passBookingLimit } from "../../shared/middlewares/passBookingLimit";
// import { checkService } from "../../shared/middlewares/checkService";
// import { avoidBookingSameServiceMultipleTimes} from "../../shared/middlewares/avoidMultipleServiceBookings";
// import { passUserBookingLimit } from "../../shared/middlewares/passUserBookingLimit";
// import { preventDoubleBooking } from "../../shared/middlewares/preventDoubleBooking";
// const userRouter = Router();

// userRouter.get("/", getUsersWithRole);

// userRouter.delete(
//     "/:id",
//     jwtAuthentication,
//     authorizeUser(["delete user"]),
//     checkUser,
//     deleteUser
// );
// userRouter.patch(
//     "/:id/role/:roleId",
//     jwtAuthentication,
//     authorizeUser(["Update user role"]),
//     checkUser,
//     checkRole,
//     updateUserRole
// );

// userRouter.post(
//     "/:id/appointment",
//     jwtAuthentication,
//     authorizeUser(["Book Appointments"]),
//     checkUser,
//     checkService,
//     passBookingLimit,
//     avoidBookingSameServiceMultipleTimes,
//     passUserBookingLimit,
//     preventDoubleBooking,
//     bookAppointment
// );

// export default userRouter;
