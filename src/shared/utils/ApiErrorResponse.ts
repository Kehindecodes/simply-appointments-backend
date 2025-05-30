export class ApiErrorResponse extends Error {
    public status: number;
    public errors?: any;
    public stack?: string;
    constructor(
        status: number,
        message: string,
        errors?: any,
        stack?: string
    ) {
        super(message);
        this.status = status;
        this.errors = errors;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }    }
}