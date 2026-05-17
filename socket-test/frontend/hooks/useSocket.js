import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001', {
  auth: {
    token: localStorage.getItem('token')
  }
});

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to WebSocket');
    });
    
    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from WebSocket');
    });
    
    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);
  
  return { socket, isConnected };
}

export default socket;
