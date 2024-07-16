import { getMockReq, getMockRes } from "@jest-mock/express";
import { registerUser } from "../routes/User/user.controller";
import { User } from "../entity/User";
import { AppDataSource } from "../migration/data-source";

interface UserInput {
    name: string;
    email: string;
    phoneNumber: number | string ;
    password: string;
    address: string;
    userType: string;
}
const testRegisterUserValidation = (
    testName: string,
    inputData: UserInput,
    expectedStatus: number,
    expectedMessage: string
  ) => {
    it(testName, async () => {
      const req = getMockReq({ body: inputData });
      const res = getMockRes().res;
  
      await registerUser(req, res);
  
      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({
        message: expectedMessage,
      });
    });
  };
  

describe("/users", () => {
  beforeAll(async () => {
    jest.mock("../migration/data-source"); // Mock the ORM datasource
});
    it("should create a new user", async () => {
        // Mock AppDataSource methods
        
        const mockSave = jest.fn().mockImplementation((user) => {
          // This simulates returning the saved user with an id
          return Promise.resolve({ ...user, id: '123e4567-e89b-12d3-a456-426614174000' });
        });
        AppDataSource.manager.save = mockSave;
        // Mock request object
        const req = getMockReq({
            body: {
                name: "Test User",
                email: "2WUeh@example.com",
                phoneNumber: "09097876541",
                password: "password",
                address: "123 Main St",
                userType: "customer",
            },
        });
        const res = getMockRes().res;

        // Call the function
        await registerUser(req, res);

        // Assertions
        expect(mockSave).toHaveBeenCalledWith(expect.any(User)); // Check if user is saved
        expect(res.status).toHaveBeenCalledWith(201); // Check response status
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
          id: expect.any(String),
          name: "Test User",
          email: "2WUeh@example.com",
          phoneNumber: "09097876541",
          address: "123 Main St",
          userType: "customer",
          password: expect.any(String),
      })); // Check response data
    })

})

describe('User Registration Validation', () => {
    testRegisterUserValidation(
      'should validate user email',
      {
        name: "Test User",
        email: "2WUeh@exampl",
        phoneNumber: "09097876541",
        password: "password",
        address: "123 Main St",
        userType: "customer",
      },
      400,
      "Invalid email format"
    );
  
    testRegisterUserValidation(
      'should validate phone number',
      {
        name: "Test User",
        email: "valid@example.com",
        phoneNumber: "123", // Invalid phone number
        password: "password",
        address: "123 Main St",
        userType: "customer",
      },
      400,
      "Invalid phone number format"
    );

    testRegisterUserValidation(
        'should validate password',
        {
          name: "Test User",
          email: "valid@example.com",
          phoneNumber: "09097876541",
          password: "pass", // Invalid password
          address: "123 Main St",
          userType: "customer",
        },
        400,
        "Password must be at least 5 characters long"
      );

      testRegisterUserValidation(
        'should validate address',
        {
          name: "Test User",
          email: "valid@example.com",
          phoneNumber: "09097876541",
          password: "password",
          address: "", // Invalid address
          userType: "customer",
        },
        400,
        "Address cannot be empty"
      );
  });