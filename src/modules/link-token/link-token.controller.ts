import { Request, Response } from "express";
import { linkTokenService } from "./link-token.service";
import { ApiErrorResponse } from "../../shared/utils/ApiErrorResponse";

export class LinkTokenController {
  async createToken(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      if (!email) {
        throw new ApiErrorResponse(400, "Email is required");
      }

      const token = await linkTokenService.createToken(email);
      res.status(201).json({ token });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        message: error.message || "Error creating token",
      });
    }
  }

  async validateToken(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.params;
      const isValid = await linkTokenService.validateToken(token);

      if (!isValid) {
        throw new ApiErrorResponse(401, "Invalid or expired token");
      }

      res.status(200).json({ valid: true });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        message: error.message || "Error validating token",
      });
    }


  }
}

export const linkTokenController = new LinkTokenController();
