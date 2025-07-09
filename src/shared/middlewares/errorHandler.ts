import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    // Handle your custom errors
    if (err instanceof BaseError) {
        return res.status(err.statusCode).json({
            message: err.message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        });
    }

    // Handle known third-party errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({ message: err.message });
    }

    if (err.code === 'ECONNREFUSED') {
        return res.status(503).json({ message: 'Database connection failed' });
    }

    // Unknown errors
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Internal server error' });
};