import express from 'express';
import multer from 'multer';
import { signup, login, getUser } from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const upload = multer({ dest: './uploads' });

const router = express.Router();

// @desc   : Get user data
// @route  : GET /api/auth/
// @access : Private
router.get('/', authMiddleware, getUser);

// @desc   : User signup
// @route  : POST /api/auth/signup
// @access : Public
router.post('/signup', upload.single('image'), signup);

// @desc   : User login
// @route  : POST /api/auth/login
// @access : Public
router.post('/login', login);

export default router;
