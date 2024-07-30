export const ResponseStatus = {
    SUCCESS: {
        status: 200,
        message: "successful",
    },
    INVALID_DETAILS: {
        status: 401,
        message: "Username or password is incorrect",
    },
    ACCOUNT_SUSPENDED: {
        status: 401,
        message: "Your account has been suspended. Please contact admin",
    },
    ACCOUNT_DELETED: {
        status: 401,
        message: "Your account was deleted. Please contact admin",
    },
    INVALID_OTP: {
        status: 401,
        message: "Invalid OTP",
    },
    VERIFY_ACCOUNT: {
        status: 200,
        message:
            "Please verify your email address. An OTP has been sent to your email",
    },
    MISSING_FIELDS: {
        status: 400,
        message: "One or more missing fields",
    },
    UNAUTHORIZED: {
        status: 401,
        message: "Unauthorized user",
    },
    BAD_REQUEST: {
        status: 400,
        message: "Bad request",
    },
    ALREADY_EXIST: {
        status: 409,
        message: "User already exist",
    },
    ALREADY_APPLIED: {
        status: 409,
        message: "You have already applied for this job",
    },
    NOT_FOUND: {
        status: 404,
        message: "Not found",
    },
    USER_NOT_FOUND: {
        status: 404,
        message: "User not found",
    },
    RECORD_NOT_FOUND: {
        status: 404,
        message: "Records not found",
    },
    INVALID_INPUT: {
        status: 400,
        message: "Invalid input",
    },
    NOT_ELIGIBLE: {
        status: 409,
        message:
            "You are not eligible for this job based on your qualification",
    },
    APPLICATION_CLOSED: {
        status: 409,
        message: "Sorry, application for this job is closed already",
    },
    INTERNAL_SERVER_ERROR: {
        status: 500,
        message: "Internal server error",
    },
    OK: "ok",
    SEND_EMAIL_VERIFICATION: "email verification",
};
