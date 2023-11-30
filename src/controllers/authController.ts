import { User } from '../models/userModel.js';
import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

const signup: RequestHandler = async (req, res) => {
  const { name, password, passwordConfrim, email } = req.body;
  const newUser = await User.create({ name, password, passwordConfrim, email });
  res.status(StatusCodes.CREATED).json({ status: 'success', data: newUser });
};

export { signup };
