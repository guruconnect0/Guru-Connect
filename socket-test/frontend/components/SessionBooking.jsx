import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SessionBooking({ mentorId, currentUserId }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [sessionTypes, setSessionTypes] = useState([]);
  const [selectedSessionType, setSelectedSessionType] = useState('');
  
  useEffect(() => {
    // Fetch session types
    axios.get('http://localhost:3001/api/session-types')
      .then(res => setSessionTypes(res.data));
    
    // Fetch available slots
    fetchSlots();
  }, [selectedDate]);
  
  const fetchSlots = async () => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    const res = await axios.get(`http://localhost:3001/api/bookings/mentor/${mentorId}/slots?date=${dateStr}`);
    setSlots(res.data.slots);
  };
  
  const handleBooking = async () => {
    try {
      await axios.post('http://localhost:3001/api/bookings', {
        mentorId,
        studentId: currentUserId,
        sessionTypeSlug: selectedSessionType,
        scheduledAt: `${selectedDate.toISOString().split('T')[0]}T${selectedSlot}:00`
      });
      alert('Booking request sent! Waiting for mentor approval.');
    } catch (error) {
      alert(error.response?.data?.error || 'Booking failed');
    }
  };
  
  return (
    <div className="booking-container">
      <h2>Book a Session</h2>
      
      {/* Date Picker */}
      <input 
        type="date" 
        value={selectedDate.toISOString().split('T')[0]}
        onChange={(e) => setSelectedDate(new Date(e.target.value))}
      />
      
      {/* Session Type Selection */}
      <div className="session-types">
        {sessionTypes.map(type => (
          <div 
            key={type.slug}
            className={`session-card ${selectedSessionType === type.slug ? 'selected' : ''}`}
            onClick={() => setSelectedSessionType(type.slug)}
          >
            <h3>{type.name}</h3>
            <p>{type.duration} minutes</p>
            <p className="price">
              {type.isFree ? 'FREE' : `₹${type.price}`}
            </p>
          </div>
        ))}
      </div>
      
      {/* Available Slots */}
      <div className="slots-grid">
        {slots.map(slot => (
          <button
            key={slot.time}
            className={`slot-btn ${selectedSlot === slot.time ? 'selected' : ''}`}
            onClick={() => setSelectedSlot(slot.time)}
            disabled={!slot.available}
          >
            {slot.time}
          </button>
        ))}
      </div>
      
      {/* Book Button */}
      <button 
        onClick={handleBooking}
        disabled={!selectedSlot || !selectedSessionType}
      >
        Book Session
      </button>
    </div>
  );
}

export default SessionBooking;
