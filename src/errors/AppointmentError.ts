import { BaseError } from "./BaseError";

export class AppointmentError extends BaseError {
    statusCode = 400;
    isOperational = true;
}