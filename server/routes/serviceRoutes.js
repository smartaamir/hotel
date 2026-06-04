import express from 'express';
import { 
  createServiceRequest, 
  getMyServiceRequests, 
  getAllServiceRequests, 
  updateServiceRequestStatus 
} from '../controllers/serviceController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/request', protect, createServiceRequest);
router.get('/my-requests', protect, getMyServiceRequests);
router.get('/all-requests', protect, admin, getAllServiceRequests);
router.put('/:id/status', protect, admin, updateServiceRequestStatus);

export default router;
