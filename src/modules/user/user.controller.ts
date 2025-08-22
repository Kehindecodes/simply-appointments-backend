import {Response} from "express";
import { userRepository } from "./user.repository";
import { CustomRequest } from "../../shared/types/custom-express";
import { ApiSuccessResponse } from "../../shared/utils/ApiSuccessResponse";
import { userService } from "./user.service";
import { appointmentService } from "../appointment/appointment.service";

export const userController = {

   updateUser: async (req: CustomRequest, res: Response): Promise<void> => {
          const user = req.user
          const {name, email, phoneNumber, address, userType} = req.body
          user!.name = name
          user!.email = email
          user!.phoneNumber = phoneNumber
          user!.address = address
          user!.userType = userType
          await userRepository.updateUser(user!)
          res.status(200).json(new ApiSuccessResponse(200, "", ""))
   },
   getUser: async (req: CustomRequest, res: Response): Promise<void> => {
    const user = req.user
    res.status(200).json(new ApiSuccessResponse(200, "", user))
   },
   getAllUsers: async (req: CustomRequest, res: Response): Promise<void> => {
    const users = await userService.getAllUsers(req.query)
    res.status(200).json(new ApiSuccessResponse(200, "", users))
   },
   bookAppointment: async (req: CustomRequest, res: Response): Promise<void> => {
    const user = req.user
    const {time, staffId, serviceId, date} = req.body
    await appointmentService.bookAppointment(user!.id, time, staffId, serviceId, date)
    res.status(200).json(new ApiSuccessResponse(200, "", ""))
   }

}
