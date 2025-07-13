// import { AppDataSource } from "../shared/database/migration/data-source";
// import { Role } from "../shared/database/entity/Role";
// import { Permission } from "../shared/database/entity/Permission";
// import { getMockReq, getMockRes } from "@jest-mock/express";
// import { PermissionController } from "../modules/permission/permission.controller";

// describe("Post /permissions", () => {
//     beforeEach(() => {
//         jest.mock("../shared/database/migration/data-source"); // Mock the ORM datasource
//     });
//     it("creates permission with valid data", async () => {
//         // Mock AppDataSource methods
//         const mockSave = jest.fn().mockResolvedValue(true);
//         const mockFind = jest.fn();
//         AppDataSource.manager.save = mockSave;
//         AppDataSource.manager.find = mockFind;

//         // Mock request object
//         const req = getMockReq({
//             body: {
//                 id: 1,
//                 name: "Test Permission",
//                 description: "This is a test permission",
//                 roleIds: [1, 2],
//             },
//         });
//         // find roles
//         mockFind.mockResolvedValueOnce([1, 2]);
//         const res = getMockRes().res.status(201).json(Permission);

//         // Call the function
//         await PermissionController.createPermission(req, res);

//         // Assertions
//         expect(mockFind).toHaveBeenCalledWith(
//             Role,
//             expect.objectContaining({
//                 where: expect.objectContaining({
//                     id: expect.anything(),
//                 }),
//             })
//         ); // Check if roles are found
//         expect(mockSave).toHaveBeenCalledWith(expect.any(Permission)); // Check if permission is saved
//         expect(res.status).toHaveBeenCalledWith(201); // Check response status
//         expect(res.json).toHaveBeenCalledWith(expect.any(Permission)); // Check response data
//     });
//     it("handles error when no roles are found", async () => {
//         // Mock the find method to return an empty array
//         (AppDataSource.manager.find as jest.Mock).mockResolvedValue([]);
//         const req = getMockReq({
//             body: {
//                 id: 1,
//                 name: "Test Permission",
//                 description: "This is a test permission",
//                 roleIds: [1, 2],
//             },
//         });
//         const res = getMockRes()
//             .res.status(500)
//             .send("Error creating permission");
//         await PermissionController.createPermission(req, res);
//         expect(res.status).toHaveBeenCalledWith(500);
//         expect(res.send).toHaveBeenCalledWith("Error creating permission");
//     });
//     afterAll(() => {
//         jest.clearAllMocks(); // Clear mocks after each test
//     });
// });

