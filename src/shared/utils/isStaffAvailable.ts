import { AppDataSource } from "../database/migration/data-source";
import { Appointment } from "../database/entity/Appointment";
import { format, parse } from 'date-fns';

/**
 * Checks if a staff member is available at a specific time and date.
 * @param staffId - The ID of the staff member to check.
 * @param time - The time to check availability.
 * @param date - The date to check availability.
 * @returns A Promise that resolves to true if the staff is available, false otherwise.
 */
export const isStaffAvailable = async (staffId: string, appointmentDateTime: Date): Promise<boolean> => {
    const time = format(appointmentDateTime, 'HH:mm');
    const date = format(appointmentDateTime, 'yyyy-MM-dd');
    // const parsedTime = parse(time, 'HH:mm', appointmentDateTime);
    const parsedDate = parse(date, 'yyyy-MM-dd', appointmentDateTime);


    const appointment = await AppDataSource.manager.findOne(Appointment, {
        where: {
            staffId: staffId,
            time: time,
            date: parsedDate
        },
    });
    if (appointment) {
        return false;
    }
    return true;
};