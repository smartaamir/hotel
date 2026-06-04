import mongoose from 'mongoose';

const serviceRequestSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    roomNumber: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['Room Service', 'Housekeeping', 'Spa Service', 'Valet', 'Luggage Assistance'],
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending',
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

const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema);
export default ServiceRequest;
