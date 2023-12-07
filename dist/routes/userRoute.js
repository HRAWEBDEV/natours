import { Router } from 'express';
import { signup, login, resetPassword, forgetPassword, } from '../controllers/authController.js';
import { getAllUsers } from '../controllers/userController.js';
const router = Router();
router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/reset-password').post(resetPassword);
router.route('/forget-password').post(forgetPassword);
router.route('/').get(getAllUsers);
export { router };
//# sourceMappingURL=userRoute.js.map