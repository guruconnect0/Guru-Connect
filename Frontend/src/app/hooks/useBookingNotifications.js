import { useEffect, useCallback, useRef } from 'react';
import { getSocketInstance } from '../../hooks/useSocket';
import { toast } from 'sonner';

export function useBookingNotifications({ 
  onNewBooking, 
  onBookingStatusUpdate, 
  onBookingApproved,
  onBookingRejected,
  onPaymentConfirmed 
} = {}) {
  const callbacksRef = useRef({ onNewBooking, onBookingStatusUpdate, onBookingApproved, onBookingRejected, onPaymentConfirmed });
  
  // Keep callbacks ref updated
  useEffect(() => {
    callbacksRef.current = { onNewBooking, onBookingStatusUpdate, onBookingApproved, onBookingRejected, onPaymentConfirmed };
  }, [onNewBooking, onBookingStatusUpdate, onBookingApproved, onBookingRejected, onPaymentConfirmed]);

  useEffect(() => {
    let socket = getSocketInstance();
    let isConnected = socket?.connected;

    const handleNewBooking = (data) => {
      console.log('📋 New booking received:', data);
      toast.success(`New ${data.sessionType || 'session'} booked by ${data.candidateName || 'a candidate'}!`, {
        duration: 5000
      });
      // Trigger callback if provided
      if (callbacksRef.current.onNewBooking) {
        callbacksRef.current.onNewBooking(data);
      }
    };

    const handleBookingStatusUpdate = (data) => {
      console.log('📋 Booking status updated:', data);
      
      if (data.action === 'accept') {
        toast.success('Your booking has been approved! 🎉', { duration: 5000 });
      } else if (data.action === 'reject') {
        toast.error('Your booking was rejected. Please try another slot.', { duration: 5000 });
      } else {
        const statusMessages = {
          'confirmed': 'Your booking has been confirmed!',
          'in-progress': 'Session has started!',
          'completed': 'Session completed!'
        };
        toast(statusMessages[data.status] || `Booking ${data.status}`, { duration: 5000 });
      }
      
      // Trigger callback if provided
      if (callbacksRef.current.onBookingStatusUpdate) {
        callbacksRef.current.onBookingStatusUpdate(data);
      }
    };

    const handleSessionReminder = (data) => {
      console.log('⏰ Session reminder:', data);
      toast.info(`Your session starts in 5 minutes!`, {
        duration: 10000
      });
    };

    const handlePaymentConfirmed = (data) => {
      console.log('💳 Payment confirmed:', data);
      toast.success(`Payment of ₹${data.amount} received! Booking confirmed.`, {
        duration: 5000
      });
      if (callbacksRef.current.onPaymentConfirmed) {
        callbacksRef.current.onPaymentConfirmed(data);
      }
    };

    // Connect handler for when socket becomes available
    const connectHandler = () => {
      console.log('🔌 Socket connected, setting up booking listeners...');
      isConnected = true;
      socket.on('new_booking', handleNewBooking);
      socket.on('booking_status_update', handleBookingStatusUpdate);
      socket.on('session_reminder', handleSessionReminder);
      socket.on('payment_confirmed', handlePaymentConfirmed);
    };

    // Set up listeners if socket is already connected
    if (socket && isConnected) {
      console.log('🔌 Socket already connected, setting up booking listeners...');
      socket.on('new_booking', handleNewBooking);
      socket.on('booking_status_update', handleBookingStatusUpdate);
      socket.on('session_reminder', handleSessionReminder);
      socket.on('payment_confirmed', handlePaymentConfirmed);
    }

    // Listen for socket connection events
    const checkSocketConnection = setInterval(() => {
      const currentSocket = getSocketInstance();
      if (currentSocket && currentSocket.connected && !isConnected) {
        connectHandler();
      }
    }, 1000);

    return () => {
      clearInterval(checkSocketConnection);
      if (socket) {
        socket.off('new_booking', handleNewBooking);
        socket.off('booking_status_update', handleBookingStatusUpdate);
        socket.off('session_reminder', handleSessionReminder);
      }
    };
  }, []);
}

export default useBookingNotifications;
