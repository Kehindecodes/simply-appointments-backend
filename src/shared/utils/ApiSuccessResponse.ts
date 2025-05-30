export class ApiSuccessResponse {
    constructor(
        public status: number,
        public message: string,
        public data?: any
    ) {}
}