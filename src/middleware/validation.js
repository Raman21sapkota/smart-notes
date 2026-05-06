import AppError from "../utils/AppError.js";

export const validate = (schema) => (req, res, next) => {
    
    const result = schema.safeParse(req.body);

    if (!result.success) {
        // extracting all error messages and join them
        const message = result.error.issues
            .map(err => err.message)
            .join(", ");

            console.log("Validation error:", message);

        return next(new AppError(message, 400));
    }


    // replace req.body with validated and normalized data
   
    req.body = result.data;
    next();
};