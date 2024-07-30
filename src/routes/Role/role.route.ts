import express from "express";
import { createRole, getRoles, getRole } from "./role.controller";
import { checkRole } from "../../middlewares/checkRole";
import { jwtAuthentication } from "../../middlewares/jwtAuthentication";
import { authorizeUser } from "../../middlewares/authorizeUser";

const roleRouter = express.Router();

roleRouter.post("/", jwtAuthentication, createRole);
roleRouter.get("/", jwtAuthentication,authorizeUser(["view Roles"]), getRoles);
roleRouter.get("/:id", jwtAuthentication, authorizeUser(["view Roles"]), checkRole, getRole);

export default roleRouter;
