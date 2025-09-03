import express from "express";
import { PermissionController } from "./permission.controller";
import { asyncHandlerAsyncAwait } from "../../shared/utils/asyncHandlerAsyncAwait";

const permissionRouter = express.Router();

permissionRouter.post("/", asyncHandlerAsyncAwait(PermissionController.createPermission));
permissionRouter.get("/", asyncHandlerAsyncAwait(PermissionController.getPermissions));
permissionRouter.get("/role/:id", asyncHandlerAsyncAwait(PermissionController.getRoleWithPermission));

export default permissionRouter;
