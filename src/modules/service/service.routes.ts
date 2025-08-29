import express from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { serviceController } from "./service.controller";
import { jwtAuthentication } from "../../shared/middlewares/jwtAuthentication";
import { authorizeUser } from "../../shared/middlewares/authorizeUser";
import { checkService } from "../../shared/middlewares/checkService";

const serviceRouter = express.Router();

serviceRouter.post("/",
    jwtAuthentication,
    authorizeUser(["Create Service"]),
    asyncHandler(serviceController.createService));

serviceRouter.get("/",
    jwtAuthentication,
    authorizeUser(["View Services"]),
    asyncHandler(serviceController.getAllServices));

serviceRouter.get("/:id",
    jwtAuthentication,
    authorizeUser(["View Services"]),
    checkService,
    asyncHandler(serviceController.getService));

serviceRouter.delete("/:id",
    jwtAuthentication,
    authorizeUser(["Delete Service"]),
    checkService,
    asyncHandler(serviceController.deleteService));

serviceRouter.patch("/:id",
    jwtAuthentication,
    authorizeUser(["Update Service"]),
    checkService,
    asyncHandler(serviceController.updateService));
