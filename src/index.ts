import express, { Request, Response } from "express";
import cors from "cors";
import permissionRouter from "./routes/Permission/permission.route";
import roleRouter from "./routes/Role/role.route";
import { errorHandler } from "./middlewares/errorHandler";


const app = express();



// middlewares
app.use(express.json());
app.use(cors());


//routes
app.use('/api/v1/permissions', permissionRouter);
app.use('/api/v1/roles', roleRouter);




export default app