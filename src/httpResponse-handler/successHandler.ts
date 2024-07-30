const successHandler = (success: any, res: any) => {
    const message = success.message || "Update Successful";
    const status = success.status || 200;
    return res.status(status).json({
        success: true,
        status: status,
        message: message,
    });
};

module.exports = successHandler;
