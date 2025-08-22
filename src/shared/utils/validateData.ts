import { validate } from "class-validator";
import { AppValidationError } from "../../errors/AppValidationError";

export const validateEntity = async (entity: any) => {
    const errors = await validate(entity);
    if (errors.length > 0) {
        const errorMessage = errors[0].constraints
            ? Object.values(errors[0].constraints)[0]
            : "Validation error";
        throw new AppValidationError(errorMessage);
    }
    return;
}
