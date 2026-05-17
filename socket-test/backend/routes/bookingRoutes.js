const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Availability = require('../models/Availability');
const SessionType = require('../models/SessionType');
const { emitToUser } = require('../socket'); // We'll create this

// GET available slots for a mentor on a specific date
router.get('/mentor/:mentorId/slots', async (req, res) => {
  try {
    const { date } = req.query; // Format: YYYY-MM-DD
    const mentorId = req.params.mentorId;
    
    // Get mentor's availability for this day of week
    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay();
    
    const dayAvailability = await Availability.findOne({
      mentor: mentorId,
      dayOfWeek: dayOfWeek,
      isActive: true
    });
    
    if (!dayAvailability) {
      return res.json({ slots: [] });
    }
    
    // Get existing bookings for this date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const existingBookings = await Booking.find({
      mentor: mentorId,
      scheduledAt: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ['pending', 'approved'] }
    });
    
    // Generate available time slots
    const slots = generateTimeSlots(dayAvailability, existingBookings);
    
    res.json({ slots, availability: dayAvailability });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate available 30-minute slots
function generateTimeSlots(availability, bookings) {
  const slots = [];
  const [startHour, startMin] = availability.startTime.split(':').map(Number);
  const [endHour, endMin] = availability.endTime.split(':').map(Number);
  
  let current = startHour * 60 + startMin; // Convert to minutes
  const end = endHour * 60 + endMin;
  
  while (current + 60 <= end) { // Minimum 60-min slot needed
    const slotStart = new Date();
    slotStart.setHours(Math.floor(current / 60), current % 60, 0, 0);
    
    // Check if this slot conflicts with any booking
    const isBooked = bookings.some(booking => {
      const bookingTime = new Date(booking.scheduledAt);
      const slotEnd = new Date(slotStart);
      slotEnd.setMinutes(slotEnd.getMinutes() + booking.duration);
      
      return bookingTime.getTime() === slotStart.getTime();
    });
    
    if (!isBooked) {
      slots.push({
        time: slotStart.toTimeString().slice(0, 5),
        available: true
      });
    }
    
    current += 30; // 30-minute intervals
  }
  
  return slots;
}

// POST create a new booking
router.post('/', async (req, res) => {
  try {
    const { mentorId, studentId, sessionTypeSlug, scheduledAt } = req.body;
    
    // Get session type details
    const sessionType = await SessionType.findOne({ slug: sessionTypeSlug });
    if (!sessionType) {
      return res.status(400).json({ error: 'Invalid session type' });
    }
    
    // Check free demo limit (1 per student per mentor)
    if (sessionType.isFree) {
      const existingFreeDemo = await Booking.findOne({
        mentor: mentorId,
        student: studentId,
        sessionType: 'demo',
        status: { $in: ['approved', 'completed'] }
      });
      
      if (existingFreeDemo) {
        return res.status(400).json({ 
          error: 'You have already used your free demo with this mentor' 
        });
      }
    }
    
    // Create booking
    const booking = new Booking({
      mentor: mentorId,
      student: studentId,
      sessionType: sessionTypeSlug,
      scheduledAt: new Date(scheduledAt),
      duration: sessionType.duration,
      totalAmount: sessionType.price,
      status: 'pending',
      roomId: generateRoomId() // Generate unique room ID
    });
    
    await booking.save();
    
    // Emit WebSocket event to mentor
    emitToUser(mentorId, 'booking:new', {
      bookingId: booking._id,
      studentName: 'Student Name', // Get from user lookup
      sessionType: sessionType.name,
      scheduledAt: booking.scheduledAt
    });
    
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH approve booking (mentor only)
router.patch('/:id/approve', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    
    // Notify student
    emitToUser(booking.student, 'booking:approved', {
      bookingId: booking._id,
      roomId: booking.roomId,
      scheduledAt: booking.scheduledAt
    });
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH reject booking (mentor only)
router.patch('/:id/reject', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    
    // Notify student
    emitToUser(booking.student, 'booking:rejected', {
      bookingId: booking._id
    });
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function generateRoomId() {
  return 'room_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

module.exports = router;
