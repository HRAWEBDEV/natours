import { User } from '../models/userModel.js';
import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../utils/AppError.js';

const verifyToken = (
  token: string,
): Promise<string | undefined | jwt.VerifyErrors> => {
  return new Promise((reject, resolve) => {
    jwt.verify(token!, process.env.JWT_SECRET!, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded);
    });
  });
};

const signToken = (id: string): Promise<string | undefined | Error> => {
  return new Promise((resovle, reject) => {
    jwt.sign(
      { id },
      process.env.JWT_SECRET!,
      {
        expiresIn: '3 days',
      },
      (err, token) => {
        if (err) return reject(err);
        resovle(token);
      },
    );
  });
};

const unAuthorizedUser = () => {
  throw new AppError('please login first', StatusCodes.UNAUTHORIZED);
};

const wrongPassAndEmailAuthorize = () => {
  throw new AppError('Incorrect email and password', StatusCodes.UNAUTHORIZED);
};

const protect: RequestHandler = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) unAuthorizedUser();
  const token = authorization?.split(' ')[1];
  if (!token) unAuthorizedUser();
  // * verify token
  const decoded = await verifyToken(token!);
  next();
};

const signup: RequestHandler = async (req, res) => {
  const { name, password, passwordConfrim, email } = req.body;
  const newUser = await User.create({ name, password, passwordConfrim, email });
  const token = signToken(newUser._id.toString());

  res
    .status(StatusCodes.CREATED)
    .json({ status: 'success', data: { user: newUser }, token });
};

const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  // * check if email and password exists
  if (!email || !password) wrongPassAndEmailAuthorize();
  const user = await User.findOne({ email }).select('+password');
  // * if user does not exist
  if (!user)
    throw new AppError(
      'Incorrect email and password',
      StatusCodes.UNAUTHORIZED,
    );
  const isPasswordCorrect = await user.correctPassword(password, user.password);
  if (!isPasswordCorrect) wrongPassAndEmailAuthorize();
  // * check if the email and password is correct
  const token = await signToken(user._id.toString());
  res.status(StatusCodes.OK).json({ status: 'success', token });
};

export { signup, login, protect };
