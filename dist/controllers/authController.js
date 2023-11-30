import { User } from '../models/userModel.js';
import { StatusCodes } from 'http-status-codes';
const signup = async (req, res) => {
    const newUser = await User.create(req.body);
    res.status(StatusCodes.CREATED).json({ status: 'success', data: newUser });
};
export { signup };
//# sourceMappingURL=authController.js.map