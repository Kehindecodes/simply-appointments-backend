import { Request, Response, NextFunction, RequestHandler } from 'express';

export const asyncHandlerAsyncAwait = (fn:(req:Request, res:Response, next:NextFunction)=>void) => async (req:Request, res:Response, next:NextFunction) => {
    try {
      // Execute the provided asynchronous function (fn) with the Express request, response, and next parameters
      await fn(req, res, next);
    } catch (error: any) {
      // If an error occurs during execution, handle it by sending an error response
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
        ...(process.env.NODE_ENV === 'development' && { stack: error.statusCode? error.stack : undefined })
      });
    }
  };




// const asyncHandlerAsyncAwait = <T = void>(
//     fn: (req: Request, res: Response, next: NextFunction) => Promise<T>
// ): RequestHandler => {
//     return (req: Request, res: Response, next: NextFunction) => {

//         return Promise.resolve(fn(req, res, next)).catch(next);
//     };
// };