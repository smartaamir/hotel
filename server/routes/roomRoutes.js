import express from 'express';
import { getRooms, getRoomById, createRoom, updateRoom, deleteRoom, updateRoomStatus } from '../controllers/roomController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getRooms)
  .post(protect, admin, createRoom);

router.route('/:id')
  .get(getRoomById)
  .put(protect, admin, updateRoom)
  .delete(protect, admin, deleteRoom);

router.put('/:id/status', protect, admin, updateRoomStatus);

export default router;
