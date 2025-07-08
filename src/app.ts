import express, { Request, Response } from "express";
import cors from "cors";
import roleRouter from "./routes/Role/role.route";
import userRouter from "./routes/User/user.route";
import passport from "passport";
import {localStrategy} from "./shared/config";
import permissionRouter from "./routes/Permission/permission.route";
import { serviceRouter } from "./routes/Service/service.route";
import authRouter from "./modules/auth/auth.routes";

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
app.use("/api/v1/permissions", permissionRouter);
app.use("/api/v1/roles", roleRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/services", serviceRouter);
app.use("/api/v1/auth", authRouter);

// Global error handling middleware
app.use((error: Error, req: Request, res: Response) => {
   console.error('Unhandled error:', error);
   res.status(500).json({
     message: 'Internal server error',
     status: 500
   });
});

export default app;
