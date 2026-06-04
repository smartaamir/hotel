import express from 'express';
import { 
  createBooking, 
  getMyBookings, 
  getAllBookings, 
  getAvailableRoomsForBooking, 
  assignRoomAndApprove, 
  checkInBooking, 
  checkOutBooking, 
  cancelBooking 
} from '../controllers/bookingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/all-bookings', protect, admin, getAllBookings);

router.get('/:id/available-rooms', protect, admin, getAvailableRoomsForBooking);
router.put('/:id/assign-approve', protect, admin, assignRoomAndApprove);
router.put('/:id/check-in', protect, admin, checkInBooking);
router.put('/:id/check-out', protect, admin, checkOutBooking);
router.put('/:id/cancel', protect, cancelBooking);

export default router;
