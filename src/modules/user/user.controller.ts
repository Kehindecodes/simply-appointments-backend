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
    try {
    const user = req.user
    res.status(200).json(user)
   } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({message: "Internal server error"});
   }
   },
   getAllUsers: async (req: CustomRequest, res: Response): Promise<void> => {
    try {
    const users = await userService.getAllUsers(req.query)
    res.status(200).json(users)
   } catch (error) {
    console.error("Error getting all users:", error);
    res.status(500).json({message: "Internal server error"});
   }
   },
   bookAppointment: async (req: CustomRequest, res: Response): Promise<void> => {
   try {
    const {user, staff, service} = req
    const {time, date} = req.body
    await appointmentService.bookAppointment({time, service, date, user, staff})
    res.status(200).json()
   } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({message: "Internal server error"});
   }
   },
   deleteUser: async (req: CustomRequest, res: Response): Promise<void> => {
   try {
    const user = req.user
    await userRepository.deleteUser(user!)
    res.status(204).json()
   } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({message: "Internal server error"});
   }
   },
   getUserAppointments: async (req: CustomRequest, res: Response): Promise<void> => {
    const user = req.user
    const appointments = await appointmentRepository.getAppointmentsByUserId(user!)
    res.status(200).json(appointments)
   },
   assignServiceToStaff: async (req: CustomRequest, res: Response): Promise<void> => {
   try {
      const {staff, service} = req
    await userRepository.addServiceToStaff(staff!, service!)
    res.status(204).end()
   } catch (error) {
    console.error("Error adding service to staff:", error);
    res.status(500).json({message: "Internal server error"});
   }
   },
   getStaffWithServices: async (req: CustomRequest, res: Response): Promise<void> => {
   try {
    const staff = req.staff
    const staffWithServices = await userRepository.getStaffWithServices(staff!)
    res.status(200).json(staffWithServices!.services)
   } catch (error) {
    console.error("Error getting user services:", error);
    res.status(500).json({message: "Internal server error"});
   }
   },
   deleteUserService: async (req: CustomRequest, res: Response): Promise<void> => {
   try {
    const {staff, service} = req
    await userRepository.deleteUserService(staff!, service!)
    res.status(204).json()
   } catch (error) {
    console.error("Error deleting user service:", error);
    res.status(500).json({message: "Internal server error"});
   }
   },
   updateUserRole: async (req: CustomRequest, res: Response): Promise<void> => {
   try {
    const { user, role} = req
    await userService.changeUserRole(user!, role!)
    res.status(204).json();
   } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({message: "Internal server error"});
   }
}
}
