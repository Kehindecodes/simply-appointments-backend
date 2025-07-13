export abstract class BaseError extends Error {
    abstract statusCode: number;
    abstract isOperational: boolean;

    constructor(message: string, public context?: any) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this);
    }
}