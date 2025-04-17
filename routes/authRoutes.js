
import express from 'express';
import * as authController from '../controllers/authController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Protected Routes 
router.get('/users', authenticate, authorize(['admin']), authController.getAllUsers);
router.get('/users/:id', authenticate, authorize(['admin']), authController.getUserById);
router.put('/users/:id', authenticate, authorize(['admin']), authController.updateUser);
router.delete('/users/:id', authenticate, authorize(['admin']), authController.deleteUser);

export default router;
