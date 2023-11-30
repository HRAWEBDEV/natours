import { User } from '../models/userModel.js';
import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../utils/AppError.js';

const getAllUsers: RequestHandler = async (req, res) => {
  const users = await User.find();
  res.status(StatusCodes.OK).json({ status: 'success', data: users });
};

export { getAllUsers };
