import { Router } from 'express';
import {
  signup,
  login,
  resetPassword,
  forgetPassword,
  changePassword,
  protect,
} from '../controllers/authController.js';
import { getAllUsers } from '../controllers/userController.js';

const router = Router();
router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/forget-password').post(forgetPassword);
router.route('/reset-password/:resetToken').patch(resetPassword);
router.route('/').get(getAllUsers);
router.route('/change-password').post(protect, changePassword);

export { router };
