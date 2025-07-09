import { BaseError } from "./BaseError";

export class OtpError extends BaseError {
    statusCode = 500;
    isOperational = true;
}
