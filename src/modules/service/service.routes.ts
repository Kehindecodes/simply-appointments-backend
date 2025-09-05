import express from "express";
import { asyncHandlerAsyncAwait } from "../../shared/utils/asyncHandlerAsyncAwait";
import { serviceController } from "./service.controller";
import { jwtAuthentication } from "../../shared/middlewares/jwtAuthentication";
import { authorizeUser } from "../../shared/middlewares/authorizeUser";
import { checkService } from "../../shared/middlewares/checkService";

const serviceRouter = express.Router();

serviceRouter.post("/",
    jwtAuthentication,
    authorizeUser(["Create Service"]),
    asyncHandlerAsyncAwait(serviceController.createService));

serviceRouter.get("/",
    jwtAuthentication,
    authorizeUser(["View Services"]),
    asyncHandlerAsyncAwait(serviceController.getAllServices));

serviceRouter.get("/:serviceId",
    jwtAuthentication,
    authorizeUser(["View Services"]),
    checkService,
    asyncHandlerAsyncAwait(serviceController.getService));

serviceRouter.delete("/:serviceId",
    jwtAuthentication,
    authorizeUser(["Delete Service"]),
    checkService,
    asyncHandlerAsyncAwait(serviceController.deleteService));

serviceRouter.patch("/:serviceId",
    jwtAuthentication,
    authorizeUser(["Update Service"]),
    checkService,
    asyncHandlerAsyncAwait(serviceController.updateService));


export default serviceRouter;