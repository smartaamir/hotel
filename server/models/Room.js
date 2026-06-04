import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ['Single Room', 'Double Room', 'Deluxe Suite', 'Presidential Suite'],
      required: true,
    },
    pricePerNight: {
      type: Number,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    amenities: [
      {
        type: String,
      },
    ],
    images: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ['Vacant', 'Occupied', 'Cleaning', 'Maintenance'],
      default: 'Vacant',
    },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model('Room', roomSchema);
export default Room;
