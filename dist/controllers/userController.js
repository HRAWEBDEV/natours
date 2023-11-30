import { User } from '../models/userModel.js';
import { StatusCodes } from 'http-status-codes';
const getAllUsers = async (req, res) => {
    const users = await User.find();
    res.status(StatusCodes.OK).json({ status: 'success', data: users });
};
export { getAllUsers };
//# sourceMappingURL=userController.js.map