import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    roomType: {
      type: String,
      enum: ['Single Room', 'Double Room', 'Deluxe Suite', 'Presidential Suite'],
      required: true,
    },
    assignedRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      default: null,
    },
    checkInDate: {
      type: Date,
      required: true,
    },
    checkOutDate: {
      type: Date,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending Approval', 'Approved', 'Checked In', 'Checked Out', 'Cancelled'],
      default: 'Pending Approval',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Refunded'],
      default: 'Pending',
    },
    paymentMethod: {
      type: String,
      enum: ['Card', 'JazzCash', 'Easypaisa', 'Bank Transfer'],
      default: 'Card',
    },
    transactionId: {
      type: String,
      default: '',
    },
    guestNotes: {
      type: String,
      default: '',
    },
    diningPlan: {
      type: String,
      default: 'None',
    },
    extraAmenities: {
      type: [String],
      default: [],
    },
    paymentProof: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
