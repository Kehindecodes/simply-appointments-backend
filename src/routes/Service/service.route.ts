import { Router } from "express";
import { checkService } from "../../middlewares/checkService";
import {
    createService,
    deleteService,
    getService,
    getServices,
    updateService,
} from "./service.controller";
import { jwtAuthentication } from "../../middlewares/jwtAuthentication";
import { authorizeUser } from "../../middlewares/authorizeUser";

export const serviceRouter = Router() as Router;
serviceRouter.post(
    "/",
    // jwtAuthentication,
    // authorizeUser,
    createService
);
serviceRouter.get(
    "/:id",
    // jwtAuthentication,
    // authorizeUser,
    checkService,
    getService
);
serviceRouter.get("/",
    //  jwtAuthentication,
    // authorizeUser,
    getServices
);

serviceRouter.delete(
    "/:id",
    // jwtAuthentication,
    // authorizeUser,
    checkService,
    deleteService
);
serviceRouter.patch(
    "/:id",
    jwtAuthentication,
    authorizeUser,
    checkService,
    updateService
);
