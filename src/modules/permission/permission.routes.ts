import express from "express";
import { PermissionController } from "./permission.controller";
import { asyncHandler } from "../../shared/utils/asyncHandler";

const permissionRouter = express.Router();

permissionRouter.post("/", asyncHandler(PermissionController.createPermission));
permissionRouter.get("/", asyncHandler(PermissionController.getPermissions));
permissionRouter.get("/role/:id", asyncHandler(PermissionController.getRoleWithPermission));

export default permissionRouter;
