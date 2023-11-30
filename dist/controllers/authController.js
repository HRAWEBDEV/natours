import { User } from '../models/userModel.js';
import { StatusCodes } from 'http-status-codes';
const signup = async (req, res) => {
    const { name, password, passwordConfrim, email } = req.body;
    const newUser = await User.create({ name, password, passwordConfrim, email });
    res.status(StatusCodes.CREATED).json({ status: 'success', data: newUser });
};
export { signup };
//# sourceMappingURL=authController.js.map