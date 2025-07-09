import { BaseError } from "./BaseError";

export class AppValidationError extends BaseError {
    statusCode = 400;
    isOperational = true;
}