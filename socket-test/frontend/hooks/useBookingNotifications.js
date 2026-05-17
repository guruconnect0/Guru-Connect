import { useEffect } from 'react';
import socket from '../hooks/useSocket';
import { toast } from 'react-toastify';

export function useBookingNotifications() {
  useEffect(() => {
    // New booking notification (for mentors)
    socket.on('booking:new', (data) => {
      toast.info(`New booking request from ${data.studentName}!`, {
        autoClose: false,
        action: {
          label: 'View',
          onClick: () => window.location.href = `/bookings/${data.bookingId}`
        }
      });
    });
    
    // Booking approved notification (for students)
    socket.on('booking:approved', (data) => {
      toast.success('Your booking has been approved!', {
        autoClose: false,
        action: {
          label: 'Join',
          onClick: () => window.location.href = `/session/${data.roomId}`
        }
      });
    });
    
    // Booking rejected notification
    socket.on('booking:rejected', (data) => {
      toast.error('Your booking was rejected. Please try another slot.');
    });
    
    // Session reminder (5 minutes before)
    socket.on('session:reminder', (data) => {
      toast.info(`Your session starts in 5 minutes!`, {
        autoClose: false,
        action: {
          label: 'Join',
          onClick: () => window.location.href = `/session/${data.roomId}`
        }
      });
    });
    
    return () => {
      socket.off('booking:new');
      socket.off('booking:approved');
      socket.off('booking:rejected');
      socket.off('session:reminder');
    };
  }, []);
}

export default useBookingNotifications;
