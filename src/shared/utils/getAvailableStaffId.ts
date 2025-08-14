import { format } from "date-fns";
import { User } from "../database/entity/User";
import { AppDataSource } from "../database/migration/data-source";
import { assignAvailableStaff } from "./assignAvailableStaff";
import { isStaffAvailable } from "./isStaffAvailable";

// /**
//  * Gets an available staff ID for a given service, time, and date.
//  * @param requestedStaffId - The ID of the requested staff member (optional).
//  * @param serviceId - The ID of the service.
//  * @param time - The time of the service.
//  * @param date - The date of the service.
//  * @returns A Promise that resolves to the available staff ID if found, or null if no staff is available.
//  */
// export const getAvailableStaffId = async (
//     requestedStaffId: string | undefined,
//     serviceId: string,
//     appointmentDateTime: Date
// ): Promise<string | null> => {
//     let staffId = requestedStaffId;
//     if (!staffId) {
//         const staff = await assignAvailableStaff(serviceId, appointmentDateTime);
//         staffId = staff?.id;
//     }
//     if (staffId && (await isStaffAvailable(staffId, appointmentDateTime))) {
//         return staffId;
//     }
//     return null;
// };
