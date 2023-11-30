import { AppError } from './AppError.js';
const checkOperationalErrors = (err) => {
    let message = err.message;
    let statusCode = err.statusCode;
    // * invalid id
    if (err.name == 'CastError') {
        message = `Invalid ${err.path}: ${err.value}`;
        statusCode = 400;
    }
    // * unique error
    if (err.code == 11000) {
        message = `Duplicate field value, please use another value`;
        statusCode = 400;
    }
    // * validation errors
    if (err.name == 'ValidationError') {
        message = Object.keys(err.errors)
            .map((key) => err.errors[key].message)
            .join(', ');
        statusCode = 400;
    }
    return new AppError(message, statusCode);
};
export { checkOperationalErrors };
//# sourceMappingURL=checkOperationalErrors.js.map