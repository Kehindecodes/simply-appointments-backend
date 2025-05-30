import { getMockReq, getMockRes } from "@jest-mock/express";
import { AppDataSource } from "../shared/database/migration/data-source";
import { bookAppointment } from "../routes/Apppointment/appointment.controller";
import { Appointment } from "../entity/Appointment";
import { AppointmentStatus } from "../shared/config/enums/AppointmentStatus";



describe("appointments", () => {
    beforeAll(async () => {
        jest.mock("../migration/data-source");
    });

    it("should create a new appointment", async () => {
        const req = getMockReq({
            body: {
                userId: "123e4567-e89b-12d3-a456-426614174000",
                time: new Date().toISOString(),
                staffId: "123e4567-e89b-12d3-a456-426614174000",
                serviceId: "123e4567-e89b-12d3-a456-426614174000",
                date : new Date(),
                status: AppointmentStatus.PENDING
            }
        });
        const res = getMockRes().res;

        const mockSave = jest.fn().mockImplementation((appointment) => {
            console.log("mockSave called with:", appointment);
            return Promise.resolve({ ...appointment, id: '123e4567-e89b-12d3-a456-426614174000'});
        });

        AppDataSource.manager.save = mockSave;

        await bookAppointment(req, res);

        expect(mockSave).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: "Appointment created successfully",
            success: true,
            status: 201,
            data: {
                id: '123e4567-e89b-12d3-a456-426614174000',
                userId: "123e4567-e89b-12d3-a456-426614174000",
                time: new Date().toISOString(),
                staffId: "123e4567-e89b-12d3-a456-426614174000",
                serviceId: "123e4567-e89b-12d3-a456-426614174000",
                date : new Date(),
                status: AppointmentStatus.PENDING
            }
        });
    })
})