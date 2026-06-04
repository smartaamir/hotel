import express from 'express';
import { 
  registerUser, 
  authUser, 
  getUserProfile, 
  googleAuthUser, 
  updateUserProfile,
  getAllAdmins,
  createAdmin,
  removeAdmin
} from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/google-login', googleAuthUser);
router.get('/me', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Administrator Account Management Routes
router.get('/admins', protect, admin, getAllAdmins);
router.post('/admins', protect, admin, createAdmin);
router.delete('/admins/:id', protect, admin, removeAdmin);

export default router;
