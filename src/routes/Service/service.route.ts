import { Router } from "express";
import { checkService } from "../../middlewares/checkService";
import {
    createService,
    deleteService,
    getService,
    getServices,
} from "./service.controller";

export const serviceRouter = Router() as Router;
serviceRouter.post("/:id", checkService, createService);
serviceRouter.get("/:id", checkService, getService);
serviceRouter.get("/", getServices);
serviceRouter.delete("/:id", checkService, deleteService);
