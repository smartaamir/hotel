import ServiceRequest from '../models/ServiceRequest.js';
import Booking from '../models/Booking.js';

// @desc    Submit a service request
// @route   POST /api/services/request
// @access  Private
export const createServiceRequest = async (req, res) => {
  const { bookingId, type, details, paymentProof } = req.body;

  try {
    const booking = await Booking.findById(bookingId).populate('assignedRoom');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.customer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Unauthorized access to this booking' });
    }

    if (booking.status !== 'Checked In') {
      return res.status(400).json({ message: 'You can only request services while checked into your room' });
    }

    const roomNumber = booking.assignedRoom ? booking.assignedRoom.roomNumber : 'N/A';

    const serviceRequest = await ServiceRequest.create({
      booking: bookingId,
      customer: req.user._id,
      roomNumber,
      type,
      details,
      paymentProof: paymentProof || '',
      status: 'Pending'
    });

    res.status(201).json(serviceRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my service requests
// @route   GET /api/services/my-requests
// @access  Private
export const getMyServiceRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ customer: req.user._id })
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all service requests (Admin only)
// @route   GET /api/services/all-requests
// @access  Private/Admin
export const getAllServiceRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({})
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update service request status (Admin only)
// @route   PUT /api/services/:id/status
// @access  Private/Admin
export const updateServiceRequestStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const serviceRequest = await ServiceRequest.findById(req.params.id);

    if (!serviceRequest) {
      return res.status(404).json({ message: 'Service request not found' });
    }

    serviceRequest.status = status;
    const updatedRequest = await serviceRequest.save();

    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
