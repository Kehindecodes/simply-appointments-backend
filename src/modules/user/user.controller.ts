import {Response} from "express";
import { userRepository } from "./user.repository";
import { CustomRequest } from "../../shared/types/custom-express";
import { userService } from "./user.service";
import { appointmentService } from "../appointment/appointment.service";
import { appointmentRepository } from "../appointment/appointment.repository";

export const userController = {

   updateUser: async (req: CustomRequest, res: Response): Promise<void> => {
          const user = req.user
          const {name, email, phoneNumber, address} = req.body
          user!.name = name
          user!.email = email
          user!.phoneNumber = phoneNumber
          user!.address = address
          await userRepository.updateUser(user!)
          res.status(200).json(user)
   },
   getUser: async (req: CustomRequest, res: Response): Promise<void> => {
    const user = req.user
    res.status(200).json(user)
   },
   getAllUsers: async (req: CustomRequest, res: Response): Promise<void> => {
    const users = await userService.getAllUsers(req.query)
    res.status(200).json(users)
   },
   bookAppointment: async (req: CustomRequest, res: Response): Promise<void> => {
    const {user, staff, service} = req
    const {time, date} = req.body
    await appointmentService.bookAppointment({time, service, date, user, staff})
    res.status(200).json()
   },
   deleteUser: async (req: CustomRequest, res: Response): Promise<void> => {
    const user = req.user
    await userRepository.deleteUser(user!)
    res.status(204).json()
   },
   getUserAppointments: async (req: CustomRequest, res: Response): Promise<void> => {
    const user = req.user
    const appointments = await appointmentRepository.getAppointmentsByUserId(user!)
    res.status(200).json(appointments)
   },
   addServiceToUser: async (req: CustomRequest, res: Response): Promise<void> => {
    const {user, service} = req
    await userRepository.addServiceToUser(user!, service!)
    res.status(204).json()
   },
   getUserServices: async (req: CustomRequest, res: Response): Promise<void> => {
    const user = req.user
    const services = await userRepository.getUserServices(user!)
    res.status(200).json(services)
   },
   deleteUserService: async (req: CustomRequest, res: Response): Promise<void> => {
    const {user} = req
    await userRepository.deleteUserService(user!)
    res.status(204).json()
   },
   updateUserRole: async (req: CustomRequest, res: Response): Promise<void> => {
    const {user, role} = req
    await userService.changeUserRole(user!, role!)
    res.status(204).json();
   }
}
