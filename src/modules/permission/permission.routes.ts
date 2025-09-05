import express from "express";
import { PermissionController } from "./permission.controller";
import { asyncHandlerAsyncAwait } from "../../shared/utils/asyncHandlerAsyncAwait";

const permissionRouter = express.Router();

permissionRouter.post("/", asyncHandlerAsyncAwait(PermissionController.createPermission));
permissionRouter.get("/", asyncHandlerAsyncAwait(PermissionController.getPermissions));
permissionRouter.get("/role/:roleId", asyncHandlerAsyncAwait(PermissionController.getRoleWithPermission));
permissionRouter.post("/bulk", asyncHandlerAsyncAwait(PermissionController.createBulkPermissions));
permissionRouter.get("/:permissionId", asyncHandlerAsyncAwait(PermissionController.getPermissionById));

export default permissionRouter;
