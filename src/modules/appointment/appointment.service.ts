import {
  checkIfStillInOpenHours,
  openHours,
} from "../../shared/utils/checkIfStillInOpenHours";
import { appointmentRepository } from "./appointment.repository";
import { AppointmentError } from "../../errors/AppointmentError";
import { format, parse } from "date-fns";
import { userService } from "../user/user.service";
import { AppointmentStatus } from "../../shared/config/enums/AppointmentStatus";
import {
  notifyStaff,
  sendBookingConfirmation,
} from "../../shared/utils/notification.utils";

export const appointmentService = {
  bookAppointment: async (appointmentData: any) => {
    let { time, staff, service, date, user } = appointmentData;
    const [hours, minutes] = time?.split(":");
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
      hour12: false,
    };

    // Format time to match entity validation pattern (HH:mm AM/PM)
    const formattedTime = appointmentDateTime.toLocaleTimeString(
      "en-US",
      options
    );
    time = formattedTime.replace(/^(\d):/, "0$1:"); // Ensure 2-digit hours

    if (!checkIfStillInOpenHours(appointmentDateTime)) {
      const dayName: string = appointmentDateTime.toLocaleDateString("en-US", {
        weekday: "long",
      });
      const requestedTime: string = appointmentDateTime.toLocaleTimeString(
        "en-US",
        { hour: "2-digit", minute: "2-digit" }
      );
      const { open, close }: { open: string; close: string } =
        openHours[appointmentDateTime.getDay()];

      throw new AppointmentError(
        `Appointment cannot be booked at ${requestedTime} on ${dayName}. ` +
          `We're open from ${open} to ${close} on ${dayName}s. ` +
          "Please choose a time within our business hours."
      );
    }

    const availableStaffId = await appointmentService.getAvailableStaffId(
      staff.id,
      service.id,
      appointmentDateTime
    );
    if (!availableStaffId) {
      throw new AppointmentError(
        `${staff?.name} is not available at ${time} on ${date}`
      );
    }
    const serviceDuration = service.duration;
    const serviceDurationInMilliseconds =
      durationToMilliseconds(serviceDuration);
    const appointmentTime = appointmentDateTime.getTime();
    const appointmentEndtime = new Date(
      appointmentTime + serviceDurationInMilliseconds!
    );

    const appointmentStartTime = appointmentDateTime
      .toISOString()
      .split("T")[0];

    const appointment = await appointmentRepository.createAppointment(
      appointmentStartTime,
      availableStaffId,
      service.id,
      new Date(date).toISOString(),frv44r4fr4r4frv4frv4fr4frv4
      appointmentEndtime.toISOString().split("T")[0],
      user.id,
      AppointmentStatus.PENDING
    );

    await notifyStaff(date, time, service.serviceName, staff.name, staff.email);
    await sendBookingConfirmation(
      user.name,
      date,
      time,
      service.serviceName,
      staff.name,
      user.email
    );
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
    const time = format(appointmentDateTime, "HH:mm");
    const date = format(appointmentDateTime, "yyyy-MM-dd");
    const parsedTime = parse(time, 'HH:mm', appointmentDateTime);
    const parsedDate = parse(date, "yyyy-MM-dd", appointmentDateTime);

    const appointment =
      await appointmentRepository.findStaffAppointmentAtDateTime(
        staffId,
        parsedTime,
        parsedDate
      );
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
    if (
      staffId &&
      (await appointmentService.isStaffAvailable(staffId, dateTime))
    ) {
      return staffId;
    }
    return null;
  },
};

function durationToMilliseconds(durationStr: string) {
  return durationStr
    ?.match(/\d+\s?\w+/g)
    ?.reduce((acc: number, part: string) => {
      const num = parseInt(part);
      if (isNaN(num)) return acc;
      if (part.includes("h")) return acc + num * 3600000; // hours to ms
      if (part.includes("m")) return acc + num * 60000; // minutes to ms
      if (part.includes("s")) return acc + num * 1000; // seconds to ms
      return acc;
    }, 0);
}
