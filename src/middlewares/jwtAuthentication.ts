import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { CustomRequest } from "../types/custom-express";

dotenv.config();

export const jwtAuthentication = (req: CustomRequest, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
      return res.status(401).send('Authorization header is missing');
  }
  // Remove Bearer from string
  const token = req.headers.authorization.replace(/^Bearer\s+/i, '');
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY as string, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Invalid token"
        });
      }
      if (typeof decoded === 'object' && 'id' in decoded) {
        req.userId = decoded.id; 
      } else {
        return res.status(401).send({
          message: "Invalid token payload"
        });
      }
      next();
    });
  } else {
    res.status(401).send('please login first');
  }
}