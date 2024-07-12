import express, { Request, Response } from "express";
import cors from "cors";
import permissionRouter from "./routes/Permission/permission.route";
import roleRouter from "./routes/Role/role.route";
import userRouter from "./routes/User/user.route";


const app = express();



// middlewares
app.use(express.json());
app.use(cors());


//routes
app.use('/api/v1/permissions', permissionRouter);
app.use('/api/v1/roles', roleRouter);
app.use('/api/v1/users', userRouter);




export default app