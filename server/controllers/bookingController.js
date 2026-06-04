import Booking from '../models/Booking.js';
import Room from '../models/Room.js';

// @desc    Create a new booking request
// @route   POST /api/bookings/create
// @access  Private
export const createBooking = async (req, res) => {
  const { roomType, checkInDate, checkOutDate, totalPrice, guestNotes, transactionId, paymentMethod, diningPlan, extraAmenities, paymentProof } = req.body;

  try {
    const booking = await Booking.create({
      customer: req.user._id,
      roomType,
      checkInDate: new Date(checkInDate),
      checkOutDate: new Date(checkOutDate),
      totalPrice,
      guestNotes: guestNotes || '',
      paymentStatus: transactionId ? 'Paid' : 'Pending',
      paymentMethod: paymentMethod || 'Card',
      transactionId: transactionId || '',
      diningPlan: diningPlan || 'None',
      extraAmenities: extraAmenities || [],
      paymentProof: paymentProof || '',
      status: 'Pending Approval' // Always starts as pending admin approval
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user._id })
      .populate('assignedRoom')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings/all-bookings
// @access  Private/Admin
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('customer', 'name email phone')
      .populate('assignedRoom')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get available physical rooms of a specific type for a booking's dates
// @route   GET /api/bookings/:id/available-rooms
// @access  Private/Admin
export const getAvailableRoomsForBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const { roomType, checkInDate, checkOutDate } = booking;

    // Overlap condition:
    // A booking overlaps if: (checkInDate < other.checkOutDate) AND (checkOutDate > other.checkInDate)
    // And other booking is active (Approved or Checked In)
    const overlappingBookings = await Booking.find({
      status: { $in: ['Approved', 'Checked In'] },
      assignedRoom: { $ne: null },
      checkInDate: { $lt: checkOutDate },
      checkOutDate: { $gt: checkInDate }
    }).select('assignedRoom');

    const busyRoomIds = overlappingBookings.map((b) => b.assignedRoom);

    // Find rooms of correct type that are not busy
    const availableRooms = await Room.find({
      type: roomType,
      _id: { $nin: busyRoomIds }
    });

    res.json(availableRooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign room and approve booking (Admin only)
// @route   PUT /api/bookings/:id/assign-approve
// @access  Private/Admin
export const assignRoomAndApprove = async (req, res) => {
  const { roomId } = req.body;

  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room to assign not found' });
    }

    if (room.type !== booking.roomType) {
      return res.status(400).json({ message: `Cannot assign Room ${room.roomNumber} (${room.type}) to a booking of type (${booking.roomType})` });
    }

    // Double check that the room is still free for those dates
    const doubleBookCheck = await Booking.findOne({
      _id: { $ne: booking._id },
      status: { $in: ['Approved', 'Checked In'] },
      assignedRoom: room._id,
      checkInDate: { $lt: booking.checkOutDate },
      checkOutDate: { $gt: booking.checkInDate }
    });

    if (doubleBookCheck) {
      return res.status(400).json({ message: `Room ${room.roomNumber} is already occupied/assigned during these dates` });
    }

    booking.assignedRoom = room._id;
    booking.status = 'Approved';
    
    // Save booking
    const updatedBooking = await booking.save();
    
    const populated = await Booking.findById(updatedBooking._id)
      .populate('customer', 'name email phone')
      .populate('assignedRoom');

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark booking as Checked In (Admin only)
// @route   PUT /api/bookings/:id/check-in
// @access  Private/Admin
export const checkInBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (!booking.assignedRoom) {
      return res.status(400).json({ message: 'No room assigned to this booking yet' });
    }

    booking.status = 'Checked In';
    await booking.save();

    // Mark physical room as occupied
    await Room.findByIdAndUpdate(booking.assignedRoom, { status: 'Occupied' });

    const populated = await Booking.findById(booking._id)
      .populate('customer', 'name email phone')
      .populate('assignedRoom');

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark booking as Checked Out (Admin only)
// @route   PUT /api/bookings/:id/check-out
// @access  Private/Admin
export const checkOutBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = 'Checked Out';
    await booking.save();

    // Mark physical room as cleaning
    if (booking.assignedRoom) {
      await Room.findByIdAndUpdate(booking.assignedRoom, { status: 'Cleaning' });
    }

    const populated = await Booking.findById(booking._id)
      .populate('customer', 'name email phone')
      .populate('assignedRoom');

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel booking (Customer or Admin)
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Verify authorized user
    if (req.user.role !== 'admin' && booking.customer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to cancel this booking' });
    }

    const previousStatus = booking.status;
    booking.status = 'Cancelled';
    
    if (booking.paymentStatus === 'Paid') {
      booking.paymentStatus = 'Refunded';
    }

    await booking.save();

    // If active and assigned room, release room
    if (booking.assignedRoom && (previousStatus === 'Checked In' || previousStatus === 'Approved')) {
      await Room.findByIdAndUpdate(booking.assignedRoom, { status: 'Vacant' });
    }

    const populated = await Booking.findById(booking._id)
      .populate('customer', 'name email phone')
      .populate('assignedRoom');

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
