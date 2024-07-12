import { Router } from 'express';
import { checkUserExists } from '../../middlewares/checkUserExists';
import { registerUser } from './user.controller';
// import { createService } from '../controller/ServiceController';
const userRouter = Router();

userRouter.post('/',checkUserExists, registerUser);

export default userRouter