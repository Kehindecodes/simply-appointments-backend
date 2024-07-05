
import { Request } from 'express';
import { Role } from '../entity/Role';

interface RequestWithRole extends Request {
    role?: Role;
  }