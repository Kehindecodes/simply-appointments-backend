import { AppDataSource } from "../shared/database/migration/data-source";
import { Role } from "../entity/Role";
import { getMockReq, getMockRes } from "@jest-mock/express";
import { createRole, getRole } from "../routes/Role/role.controller";

describe("/roles", () => {
    beforeAll(async () => {
        jest.mock("../migration/data-source"); // Mock the ORM datasource
    });
    it("should create a new role", async () => {
        // Mock AppDataSource methods
        const mockSave = jest.fn().mockResolvedValue(true);
        AppDataSource.manager.save = mockSave;

        // Mock request object
        const req = getMockReq({
            body: {
                id: 1,
                name: "Test Role",
                description: "This is a test role",
            },
        });
        const res = getMockRes().res;

        // Call the function
        await createRole(req, res);

        // Assertions
        expect(mockSave).toHaveBeenCalledWith(expect.any(Role)); // Check if role is saved
        expect(res.status).toHaveBeenCalledWith(201); // Check response status
        expect(res.json).toHaveBeenCalledWith(expect.any(Role)); // Check response data
    });
    it("should get a single role", async () => {
        const req = getMockReq({
            role: {
                id: 1,
                name: "Test Role",
                description: "This is a test role",
            },
        });
        const res = getMockRes().res;

        // Call the function
        await getRole(req, res);

        // Assertions
        expect(res.status).toHaveBeenCalledWith(200); // Check response status
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                id: 1,
                name: "Test Role",
                description: "This is a test role",
            })
        ); // Check response data
    });

    it("should return 404 if role is not found", async () => {
        const req = getMockReq({
            role: null,
        });
        const res = getMockRes().res;

        // Call the function
        await getRole(req, res);

        // Assertions
        expect(res.status).toHaveBeenCalledWith(404); // Check response status
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Role not found",
            })
        ); // Check response data
    });

    it("should return 500 if an error occurs", async () => {
        const req = getMockReq({
            role: null,
        });
        const res = getMockRes().res.status(500).send("Internal Server Error");

        // Call the function
        await getRole(req, res);

        // Assertions
        expect(res.status).toHaveBeenCalledWith(500); // Check response status
        expect(res.send).toHaveBeenCalledWith("Internal Server Error"); // Check response data
    });
});
