import { BaseError } from "./BaseError";

export class DatabaseError extends BaseError {
    statusCode = 500;
    isOperational = true;
}