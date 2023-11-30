class AppError extends Error {
    statusCode;
    status;
    operational;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = String(statusCode).startsWith('4') ? 'fail' : 'error';
        this.operational = true;
    }
}
export { AppError };
//# sourceMappingURL=AppError.js.map