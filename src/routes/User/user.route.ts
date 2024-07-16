import { Router } from 'express';
import { checkUserExists } from '../../middlewares/checkUserExists';
import { registerUser, loginUser } from './user.controller';
// import { createService } from '../controller/ServiceController';
const userRouter = Router();

userRouter.post('/',checkUserExists, registerUser);
userRouter.post('/login', loginUser);


export default userRouter