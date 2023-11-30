import { User } from '../models/userModel.js';
import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

const signup: RequestHandler = async (req, res) => {
  const newUser = await User.create(req.body);
  res.status(StatusCodes.CREATED).json({ status: 'success', data: newUser });
};

export { signup };
