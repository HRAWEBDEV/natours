import { Router } from 'express';
import { signup } from '../controllers/authController.js';

const router = Router();
router.route('/signup').post(signup);

export { router };
