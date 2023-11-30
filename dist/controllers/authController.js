import { User } from '../models/userModel.js';
const signup = async (req, res) => {
    const newUser = await User.create(req.body);
    res.status(201).json({ status: 'success', data: newUser });
};
export { signup };
//# sourceMappingURL=authController.js.map