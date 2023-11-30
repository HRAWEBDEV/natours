class AppError extends Error {
    statusCode;
    status;
    operational;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = String(statusCode).startsWith('4') ? 'fail' : 'error';
        this.operational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
export { AppError };
//# sourceMappingURL=AppError.js.map