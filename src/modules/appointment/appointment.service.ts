import { checkIfStillInOpenHours } from "../../shared/utils/checkIfStillInOpenHours";
import { appointmentRepository } from "./appointment.repository";
import { AppointmentError } from "../../errors/AppointmentError";
import { format, parse } from 'date-fns';
import { userService } from "../user/user.service";
import { AppointmentStatus } from "../../shared/config/enums/AppointmentStatus";
import { notifyStaff, sendBookingConfirmation } from "../../shared/utils/notification.utils";


export const appointmentService = {
    bookAppointment: async (appointmentData: any) => {
        let { time, staff, service, date, user, } = appointmentData;
        const [hours, minutes] =  time?.split(":");
        const appointmentDateTime = new Date(date);
        appointmentDateTime.setHours(
            parseInt(hours, 10),
            parseInt(minutes, 10),
            0,
            0
        );
        const options: Intl.DateTimeFormatOptions = {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        };

        // Format time to match entity validation pattern (HH:mm AM/PM)
        const formattedTime = appointmentDateTime.toLocaleTimeString("en-US", options);
        time = formattedTime.replace(/^(\d):/, '0$1:'); // Ensure 2-digit hours

        if (!checkIfStillInOpenHours(appointmentDateTime)) {
                    throw new AppointmentError("Appointment time is not in open hours");
                }

        const availableStaffId = await appointmentService.getAvailableStaffId(staff.id, service.id, appointmentDateTime);
        if (!availableStaffId) {
            throw new AppointmentError(`${staff?.name} is not available at ${time} on ${date}`);
        }
         const serviceDuration = service.duration;
         const appointmentEndtime = new Date(appointmentDateTime.getTime() + serviceDuration * 60000);

        const appointment = await appointmentRepository.createAppointment(time, availableStaffId, service.id, date, appointmentEndtime.toISOString(), user.id, AppointmentStatus.PENDING);

        await notifyStaff (date, time, service.serviceName, staff.name, staff.email);
        await sendBookingConfirmation(user.name, date, time, service.serviceName, staff.name, user.email);
        appointment.status = AppointmentStatus.CONFIRMED;
        await appointmentRepository.updateAppointment(appointment);
    },

    /**
 * Checks if a staff member is available at a specific time and date.
 * @param staffId - The ID of the staff member to check.
 * @param time - The time to check availability.
 * @param date - The date to check availability.
 * @returns A Promise that resolves to true if the staff is available, false otherwise.
 */
    isStaffAvailable: async (staffId: string, appointmentDateTime: Date) => {
         const time = format(appointmentDateTime, 'HH:mm');
             const date = format(appointmentDateTime, 'yyyy-MM-dd');
             // const parsedTime = parse(time, 'HH:mm', appointmentDateTime);
             const parsedDate = parse(date, 'yyyy-MM-dd', appointmentDateTime);


             const appointment = await appointmentRepository.findStaffAppointmentAtDateTime(staffId, time, parsedDate);
             if (appointment) {
                 return false;
             }
             return true;
    },

    getAvailableStaffId: async (
        requestedStaffId: string | undefined,
        serviceId: string,
        dateTime: Date
    ): Promise<string | null> => {
        let staffId = requestedStaffId;
            if (!staffId) {
                const staff = await userService.assignAvailableStaff(serviceId, dateTime);
                staffId = staff?.id;
            }
            if (staffId && (await appointmentService.isStaffAvailable(staffId, dateTime))) {
                return staffId;
            }
            return null;
    }
}
