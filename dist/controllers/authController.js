import { User } from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../utils/AppError.js';
const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '3 days',
});
const signup = async (req, res) => {
    const { name, password, passwordConfrim, email } = req.body;
    const newUser = await User.create({ name, password, passwordConfrim, email });
    const token = signToken(newUser._id.toString());
    res
        .status(StatusCodes.CREATED)
        .json({ status: 'success', data: { user: newUser }, token });
};
const login = async (req, res) => {
    const { email, password } = req.body;
    // * check if email and password exists
    if (!email || !password)
        throw new AppError('Please provide email and password', StatusCodes.BAD_REQUEST);
    const user = await User.findOne({ email }).select('+password');
    // * if user does not exist
    if (!user)
        throw new AppError('Incorrect email and password', StatusCodes.UNAUTHORIZED);
    const isPasswordCorrect = await user.correctPassword(password, user.password);
    if (!isPasswordCorrect)
        throw new AppError('Incorrect email and password', StatusCodes.UNAUTHORIZED);
    // * check if the email and password is correct
    const token = signToken(user._id.toString());
    res.status(StatusCodes.OK).json({ status: 'success', token });
};
export { signup, login };
//# sourceMappingURL=authController.js.map