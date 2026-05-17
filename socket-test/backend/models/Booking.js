const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionType: {
    type: String,
    enum: ['demo', 'deep'],
    required: true
  },
  scheduledAt: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  duration: {
    type: Number, // in minutes
    default: 15  // 15 for demo, 60 for deep
  },
  actualDuration: {
    type: Number,
    default: 0   // Actual time used
  },
  extensionTime: {
    type: Number,
    default: 0   // Extra minutes paid for
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  roomId: {
    type: String,
    unique: true
  },
  startedAt: Date,
  endedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
