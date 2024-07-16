
import { Request } from 'express';
import { Role } from '../entity/Role';

export interface CustomRequest extends Request {
  role?: Role;
  user?: User;
  // token?: string;
  // permissions?: string[];
}