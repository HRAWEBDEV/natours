import { ErrorRequestHandler } from 'express';
import { checkOperationalErrors } from '../utils/checkOperationalErrors.js';
import { StatusCodes } from 'http-status-codes';

const globalErrorHandler: ErrorRequestHandler = async (err, req, res, next) => {
  // * development errors
  if (process.env.MODE == 'development') {
    const statusCode = err.statusCode || 500;
    const status = err.status || 'error';
    const message = err.message || 'something went wrong';
    const stack = err.stack;
    res.status(statusCode).json({
      status,
      message,
      stack,
      err,
    });
    return;
  }
  // * production errors
  const newError = checkOperationalErrors(err);
  const { message, statusCode, status } = newError;
  if (!newError.operational) {
    console.error('error', newError);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'something went wrong',
    });
    return;
  }
  res.status(statusCode).json({
    status,
    message,
  });
};

export { globalErrorHandler };
