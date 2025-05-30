import { AppDataSource } from "../database/migration/data-source";
import { Service } from "../database/entity/Service";
import { User } from "../database/entity/User";
import { isStaffAvailable } from "./isStaffAvailable";

/**
 * Assigns an available staff member for a given service at a specific time and date.
 * @param serviceId - The ID of the service.
 * @param time - The time of the service.
 * @param date - The date of the service.
 * @returns A Promise that resolves to the assigned User if available, or null if no staff is available.
 */
export const assignAvailableStaff = async (
    serviceId: string,
    appointmentDateTime: Date
): Promise<User | null> => {
    const service = await AppDataSource.getRepository(Service)
        .createQueryBuilder("service")
        .leftJoinAndSelect("service.users", "user")
        .where("service.id = :id", { id: serviceId })
        .getOne();

    const staffs = service?.users;
    if (staffs) {
        for (const staff of staffs) {
            // return any staff that is available
            if (staff.id) {
                const isAvailable = await isStaffAvailable(
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
};
