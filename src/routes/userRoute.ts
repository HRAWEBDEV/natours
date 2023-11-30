import { Router } from 'express';
import { signup, login } from '../controllers/authController.js';
import { getAllUsers } from '../controllers/userController.js';

const router = Router();
router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/').get(getAllUsers);

export { router };
