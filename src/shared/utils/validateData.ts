import { validate } from "class-validator";

export const validateEntity = async (entity: any) => {
    const errors = await validate(entity);
    if (errors.length > 0) {
        const errorMessage = errors[0].constraints
            ? Object.values(errors[0].constraints)[0]
            : "Validation error";
        return errorMessage;
    }
    return;
}
