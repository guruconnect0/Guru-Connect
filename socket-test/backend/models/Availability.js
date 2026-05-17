const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dayOfWeek: {
    type: Number, // 0=Sunday, 6=Saturday
    required: true
  },
  startTime: {
    type: String, // "09:00" (24-hour format)
    required: true
  },
  endTime: {
    type: String, // "17:00"
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Availability', availabilitySchema);
