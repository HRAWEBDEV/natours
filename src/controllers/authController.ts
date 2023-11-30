import { User } from '../models/userModel.js';
import { RequestHandler } from 'express';

const signup: RequestHandler = async (req, res) => {
  const newUser = await User.create(req.body);
  res.status(201).json({ status: 'success', data: newUser });
};

export { signup };
