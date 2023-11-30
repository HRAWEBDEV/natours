import { ErrorRequestHandler } from 'express';

const globalErrorHandler: ErrorRequestHandler = async (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';
  const message = err.message || 'internal error';

  res.status(statusCode).json({
    status,
    message,
  });
};

export { globalErrorHandler };
