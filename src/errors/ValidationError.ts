import { BaseError } from "./BaseError";

export class ValidationError extends BaseError {
    statusCode = 400;
    isOperational = true;
}