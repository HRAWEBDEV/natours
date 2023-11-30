import { AppError } from './AppError.js';
import { StatusCodes } from 'http-status-codes';

const checkOperationalErrors = (err: any) => {
  let message = err.message;
  let statusCode = err.statusCode;
  // * invalid id
  if (err.name == 'CastError') {
    message = `Invalid ${err.path}: ${err.value}`;
    statusCode = StatusCodes.BAD_REQUEST;
  }
  // * unique error
  if (err.code == 11000) {
    message = `Duplicate field value, please use another value`;
    statusCode = StatusCodes.BAD_REQUEST;
  }
  // * validation errors
  if (err.name == 'ValidationError') {
    message = Object.keys(err.errors)
      .map((key) => err.errors[key].message)
      .join(', ');
    statusCode = StatusCodes.BAD_REQUEST;
  }
  // * invalid json web token
  if (err.name == 'JsonWebTokenError' || err.name == 'TokenExpiredError') {
    message = 'please login';
    statusCode = StatusCodes.UNAUTHORIZED;
  }

  return new AppError(message, statusCode);
};

export { checkOperationalErrors };
