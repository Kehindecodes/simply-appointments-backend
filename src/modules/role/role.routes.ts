import express from "express";
import { checkRole } from "../../shared/middlewares/checkRole";
import { jwtAuthentication } from "../../shared/middlewares/jwtAuthentication";
import { authorizeUser } from "../../shared/middlewares/authorizeUser";
import { roleController } from "./role.controller";
import { asyncHandler } from "../../shared/utils/asyncHandler";


const roleRouter = express.Router();

roleRouter.post("/",
    // jwtAuthentication,
   asyncHandler(roleController.addNewRole)
);
roleRouter.get("/",
    // jwtAuthentication,
    // authorizeUser(["view Roles"]),
    asyncHandler(roleController.getRoles)
);
roleRouter.get("/:id",
    // jwtAuthentication,
    // authorizeUser(["view Roles"]),
    checkRole,
    asyncHandler(roleController.getRole)
);

export default roleRouter;

