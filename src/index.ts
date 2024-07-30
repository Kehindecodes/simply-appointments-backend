import express, { Request, Response } from "express";
import cors from "cors";
import permissionRouter from "./routes/Permission/permission.route";
import roleRouter from "./routes/Role/role.route";
import userRouter from "./routes/User/user.route";
import passport from "passport";
import { localStrategy } from "./services/passport-config";
import { serviceRouter } from "./routes/Service/service.route";
import { appointmentRouter } from "./routes/Apppointment/appointment.route";

const app = express();

// middlewares
app.use(express.json());
app.use(cors());
// app.use(passport.initialize());
passport.use("local", localStrategy);

//routes
app.use("/api/v1/permissions", permissionRouter);
app.use("/api/v1/roles", roleRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/services", serviceRouter);
app.use("/api/v1/appointments", appointmentRouter);

export default app;
