export const errorHandler = (err: any, res: any) => {
    const error = err.message || "Something went wrong";
    const errStatus = err.status || 500;
    return res.status(errStatus).json({
        success: false,
        status: errStatus,
        message: error,
    });
};

