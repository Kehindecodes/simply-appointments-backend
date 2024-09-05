import express, { Request, Response } from "express";
import cors from "cors";
import roleRouter from "./routes/Role/role.route";
import userRouter from "./routes/User/user.route";
import passport from "passport";
import { localStrategy } from "./services/passport-config";
import permissionRouter from "./routes/Permission/permission.route";
import { serviceRouter } from "./routes/Service/service.route";
import { userServiceRouter } from "./routes/UserService/userService.route";

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
app.use("/api/v1/user-services", userServiceRouter);


export default app;
