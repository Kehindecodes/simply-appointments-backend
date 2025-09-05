import express from "express";
import { checkRole } from "../../shared/middlewares/checkRole";
import { roleController } from "./role.controller";
import { asyncHandlerAsyncAwait } from "../../shared/utils/asyncHandlerAsyncAwait";


const roleRouter = express.Router();

roleRouter.post("/",
    // jwtAuthentication,
   asyncHandlerAsyncAwait(roleController.addNewRole)
);
roleRouter.get("/",
    // jwtAuthentication,
    // authorizeUser(["view Roles"]),
    asyncHandlerAsyncAwait(roleController.getRoles)
);
roleRouter.get("/:roleId",
    // jwtAuthentication,
    // authorizeUser(["view Roles"]),
    checkRole,
    asyncHandlerAsyncAwait(roleController.getRole)
);

export default roleRouter;

