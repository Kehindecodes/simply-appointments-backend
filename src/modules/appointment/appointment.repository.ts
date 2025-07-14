import { AppDataSource } from "../../shared/database/migration/data-source";
import { Appointment } from "../../shared/database/entity/Appointment";
import { validate, ValidationError } from "class-validator";
import { AppValidationError } from "../../errors/AppValidationError";
export const appointmentRepository = {
  createAppointment: async (
    time: string,
    staffId: string,
    serviceId: string,
    date: string
  ) => {
    const appointment = AppDataSource.manager.create(Appointment, {
      time,
      staffId,
      serviceId,
      date,
    });

     const errors = await validate(appointment);

            if (errors.length > 0) {
                const errorMessage = errors[0].constraints
                    ? Object.values(errors[0].constraints)[0]
                    : "Validation error";
                throw new AppValidationError(errorMessage);
            }
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

  updateAppointment: async (id: string, data: any) => {
    const appointment = await AppDataSource.manager.findOne(Appointment, {
      where: { id },
    });
    await AppDataSource.manager.update(Appointment, id, data);
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
  }
};
