import { Request, Response, NextFunction, RequestHandler } from 'express';

export const asyncHandler = <T = void>(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<T>
): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        return Promise.resolve(fn(req, res, next)).catch(next);
    };
};