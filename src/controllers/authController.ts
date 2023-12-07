import { type TUser, User } from '../models/userModel.js';
import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../utils/AppError.js';

declare module 'express-serve-static-core' {
  interface Request {
    user: Omit<TUser, 'password' | 'confirmPassword'>;
  }
}

const verifyToken = (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token!, process.env.JWT_SECRET!, (err, decoded) => {
      if (err) {
        reject(err);
      } else resolve(decoded);
    });
  });
};

const signToken = (id: string): Promise<any> => {
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
  const token = authorization?.split(' ')[2];
  if (!token) unAuthorizedUser();
  // * verify token
  const decoded = await verifyToken(token!);
  const user = await User.findById(decoded.id);
  if (!user) unAuthorizedUser();
  if (user?.changedPasswordAfter(decoded.iat)) unAuthorizedUser();
  req.user = user!;
  next();
};

const restrictToRole = (roles: TUser['role'][]): RequestHandler => {
  return async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError(
        'you do not have permission to perform this action',
        StatusCodes.FORBIDDEN,
      );
    }
    next();
  };
};

const signup: RequestHandler = async (req, res) => {
  const { name, password, passwordConfrim, email, role } = req.body;
  const newUser = await User.create({
    name,
    password,
    passwordConfrim,
    email,
    role,
  });
  const token = await signToken(newUser._id.toString());
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

const forgetPassword: RequestHandler = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('there is no user with this email', 404);
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  res.status(200).json({ resetToken });
};

const resetPassword = async () => {};

export {
  signup,
  login,
  protect,
  restrictToRole,
  resetPassword,
  forgetPassword,
};
