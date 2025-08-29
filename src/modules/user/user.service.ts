import { User } from "../../shared/database/entity/User";
import { appointmentRepository } from "../appointment/appointment.repository";
import { appointmentService } from "../appointment/appointment.service";
import { serviceRepository } from "../service/service.repository";
import { userRepository } from "./user.repository";

export const userService = {

    assignAvailableStaff: async (
        serviceId: string,
        appointmentDateTime: Date
    ): Promise<User | null> => {
        try {
            const service = await serviceRepository.getServiceWithAssignedStaff(serviceId);
        if (!service) {
            return null;
        }

        const staffs = service.users;
        if (staffs) {
            for (const staff of staffs) {
                // return any staff that is available
                if (staff.id) {
                    const isAvailable = await appointmentService.isStaffAvailable(
                        staff.id,
                        appointmentDateTime
                    );
                    if (isAvailable) {
                        return staff;
                    }
                }
            }
        }
        return null;
        } catch (error) {
            console.error("Error assigning available staff:", error);
            return null;
        }
    },

    getAllUsers: async (query: any): Promise<User[] | null> => {
        const filters : {userType?: string} = {};
        if (query.userType) {
            filters.userType = query.userType;
        }
        const users = await userRepository.getUsers(filters);
        if (!users) {
            return [];
        }
        let data = [];
        for (const user of users) {
            data.push(user);
        }
        return data;
    }

}
