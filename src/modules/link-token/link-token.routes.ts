import { Router } from "express";
import { linkTokenController } from "./link-token.controller";
import { asyncHandler } from "../../shared/utils/asyncHandler";

const router = Router();

// Create a new token
router.post(
  "/tokens",
  asyncHandler(linkTokenController.createToken.bind(linkTokenController))
);

// Validate a token
router.get(
  "/tokens/validate/:token",
  asyncHandler(linkTokenController.validateToken.bind(linkTokenController))
);

export default router;
