import { AppDataSource } from "../../shared/database/migration/data-source";
import { Appointment } from "../../shared/database/entity/Appointment";
import { validateEntity } from "../../shared/utils/validateData";
import { AppointmentStatus } from "../../shared/config/enums/AppointmentStatus";
import { User } from "../../shared/database/entity/User";
export const appointmentRepository = {
  createAppointment: async (
    time: string,
    staffId: string,
    serviceId: string,
    date: string,
    endTime: string,
    userId: string,
    status: AppointmentStatus
  ) => {
    const appointment = AppDataSource.manager.create(Appointment, {
      time,
      staffId,
      serviceId,
      date,
      userId,
      status,
      endTime,
    });

    await validateEntity(appointment);
    await AppDataSource.manager.save(appointment);
    return appointment;
  },

  getAppointmentById: async (id: string) => {
    const appointment = await AppDataSource.manager.findOne(Appointment, {
      where: { id },
    });
    return appointment;
  },

  getAppointments: async () => {
    const appointments = await AppDataSource.manager.find(Appointment);
    return appointments;
  },

  deleteAppointment: async (appointment: Appointment) => {
    await AppDataSource.manager.remove(appointment!);
    return appointment;
  },

  updateAppointment: async (appointment: Appointment) => {
    await validateEntity(appointment);
    await AppDataSource.manager.update(Appointment, appointment.id, appointment);
    return appointment;
  },

  findStaffAppointmentAtDateTime: async (staffId: string, time: string, date: Date) => {
    const appointment = await AppDataSource.manager.findOne(Appointment, {
        where: {
            staffId: staffId,
            time: time,
            date: date
        },
    });
    return appointment;
  },

  getAppointmentsByUserId: async (user: User) => {
    const appointments = await AppDataSource.manager.find(Appointment, {
      where: { userId: user.id },
    });
    return appointments;
  },
};
