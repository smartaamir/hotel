import Room from '../models/Room.js';

// @desc    Get all rooms (supports filtering)
// @route   GET /api/rooms
// @access  Public
export const getRooms = async (req, res) => {
  try {
    const { type, status } = req.query;
    let query = {};

    if (type) query.type = type;
    if (status) query.status = status;

    const rooms = await Room.find(query);
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get room by ID
// @route   GET /api/rooms/:id
// @access  Public
export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (room) {
      res.json(room);
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a physical room
// @route   POST /api/rooms
// @access  Private/Admin
export const createRoom = async (req, res) => {
  const { roomNumber, type, pricePerNight, capacity, description, amenities, images } = req.body;

  try {
    const roomExists = await Room.findOne({ roomNumber });

    if (roomExists) {
      return res.status(400).json({ message: 'Room number already exists' });
    }

    const room = await Room.create({
      roomNumber,
      type,
      pricePerNight,
      capacity,
      description,
      amenities: amenities || [],
      images: images || [],
      status: 'Vacant'
    });

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a room
// @route   PUT /api/rooms/:id
// @access  Private/Admin
export const updateRoom = async (req, res) => {
  const { roomNumber, type, pricePerNight, capacity, description, amenities, images, status } = req.body;

  try {
    const room = await Room.findById(req.params.id);

    if (room) {
      room.roomNumber = roomNumber || room.roomNumber;
      room.type = type || room.type;
      room.pricePerNight = pricePerNight || room.pricePerNight;
      room.capacity = capacity || room.capacity;
      room.description = description || room.description;
      room.amenities = amenities || room.amenities;
      room.images = images || room.images;
      room.status = status || room.status;

      const updatedRoom = await room.save();
      res.json(updatedRoom);
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a room
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (room) {
      await room.deleteOne();
      res.json({ message: 'Room removed successfully' });
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update room status quickly
// @route   PUT /api/rooms/:id/status
// @access  Private/Admin
export const updateRoomStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const room = await Room.findById(req.params.id);

    if (room) {
      room.status = status;
      const updatedRoom = await room.save();
      res.json(updatedRoom);
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
