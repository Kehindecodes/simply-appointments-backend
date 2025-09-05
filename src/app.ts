import express from "express";
import cors from "cors";
import passport from "passport";
import {localStrategy} from "./shared/config";
import authRouter from "./modules/auth/auth.routes";
import { errorHandler } from "./shared/middlewares/errorHandler";
import roleRouter from "./modules/role/role.routes";
import appointmentRouter  from "./modules/appointment/appointment.routes";
import userRouter from "./modules/user/user.routes";
import serviceRouter from "./modules/service/service.routes";
import permissionRouter from "./modules/permission/permission.routes";
const app = express();

// middlewares
app.use(express.json());
app.use(cors());
// Security middleware
// app.use(helmet()); // Add helmet for security headers
// app.use(rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100 // limit each IP to 100 requests per windowMs
// }));
// app.use(passport.initialize());
passport.use("local", localStrategy);

//routes
app.use("/api/v1/roles", roleRouter);
app.use("/api/v1/appointments", appointmentRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/services", serviceRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/permissions", permissionRouter);

// Error handling middleware
app.use(errorHandler);


export default app;
