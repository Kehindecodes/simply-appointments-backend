import { Router } from 'express';
import { checkUserExists } from '../../middlewares/checkUserExists';
import { registerUser, loginUser, ValidateOTP, getUsersWithRole } from './user.controller';
// import { createService } from '../controller/ServiceController';
const userRouter = Router();

userRouter.post('/',checkUserExists, registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/validate-otp', ValidateOTP);
userRouter.get('/', getUsersWithRole);


export default userRouter