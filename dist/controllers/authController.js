import { User } from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../utils/AppError.js';
import { sendEmail } from '../utils/email.js';
const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                reject(err);
            }
            else
                resolve(decoded);
        });
    });
};
const signToken = (id) => {
    return new Promise((resovle, reject) => {
        jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: '3 days',
        }, (err, token) => {
            if (err)
                return reject(err);
            resovle(token);
        });
    });
};
const unAuthorizedUser = () => {
    throw new AppError('please login first', StatusCodes.UNAUTHORIZED);
};
const wrongPassAndEmailAuthorize = () => {
    throw new AppError('Incorrect email and password', StatusCodes.UNAUTHORIZED);
};
const protect = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer'))
        unAuthorizedUser();
    const token = authorization?.split(' ')[2];
    if (!token)
        unAuthorizedUser();
    // * verify token
    const decoded = await verifyToken(token);
    const user = await User.findById(decoded.id);
    if (!user)
        unAuthorizedUser();
    if (user?.changedPasswordAfter(decoded.iat))
        unAuthorizedUser();
    req.user = user;
    next();
};
const restrictToRole = (roles) => {
    return async (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new AppError('you do not have permission to perform this action', StatusCodes.FORBIDDEN);
        }
        next();
    };
};
const signup = async (req, res) => {
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
const login = async (req, res) => {
    const { email, password } = req.body;
    // * check if email and password exists
    if (!email || !password)
        wrongPassAndEmailAuthorize();
    const user = await User.findOne({ email }).select('+password');
    // * if user does not exist
    if (!user)
        throw new AppError('Incorrect email and password', StatusCodes.UNAUTHORIZED);
    const isPasswordCorrect = await user.correctPassword(password, user.password);
    if (!isPasswordCorrect)
        wrongPassAndEmailAuthorize();
    // * check if the email and password is correct
    const token = await signToken(user._id.toString());
    res.status(StatusCodes.OK).json({ status: 'success', token });
};
const forgetPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw new AppError('there is no user with this email', 404);
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/user/reset-password/${resetToken}`;
    const message = `forget your password? Submit a patch request with your new password and confirm password to: ${resetUrl}.\n if you did not forget your password ignore this email`;
    await sendEmail({
        to: email,
        subject: 'your password reset token (valid for 10 min)',
        text: message,
    });
    res.status(200).json({ status: 'success', message: 'token sent to email!' });
};
const resetPassword = async (req, res) => {
    const { resetToken } = req.body;
};
export { signup, login, protect, restrictToRole, resetPassword, forgetPassword, };
//# sourceMappingURL=authController.js.map