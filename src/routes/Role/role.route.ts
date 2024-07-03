import express from "express";
import { createRole, getRoles, getRole } from "./role.controller";
import { checkRole } from "../../middlewares/checkRole";

const roleRouter = express.Router();

roleRouter.post("/", createRole);
roleRouter.get("/", getRoles);
roleRouter.get("/:id", checkRole, getRole);

export default roleRouter;
