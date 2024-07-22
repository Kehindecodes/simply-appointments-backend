import express from "express";
import { createRole, getRoles, getRole } from "./role.controller";
import { checkRole } from "../../middlewares/checkRole";
import { jwtAuthentication } from "../../middlewares/jwtAuthentication";

const roleRouter = express.Router();

roleRouter.post("/", jwtAuthentication, createRole);
roleRouter.get("/", jwtAuthentication, getRoles);
roleRouter.get("/:id", jwtAuthentication, checkRole, getRole);

export default roleRouter;
