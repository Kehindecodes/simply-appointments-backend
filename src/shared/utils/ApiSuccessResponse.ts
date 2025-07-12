export class ApiSuccessResponse extends Response {
    constructor(
        public status: number,
        public message?: string,
        public data?: any
    ) {
        super();
    }
}