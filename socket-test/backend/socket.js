const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const io = new Server(3001, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Store user socket mappings
const userSockets = new Map(); // userId -> socketId

io.use(async (socket, next) => {
  // Verify JWT token from handshake
  const token = socket.handshake.auth.token;
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', async (socket) => {
  console.log('User connected:', socket.userId);
  
  // Map user to socket
  userSockets.set(socket.userId, socket.id);
  
  // Update user online status
  await User.findByIdAndUpdate(socket.userId, { isOnline: true, socketId: socket.id });
  
  // Join user's personal room
  socket.join(`user:${socket.userId}`);
  
  // Handle joining a booking room
  socket.on('join:room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.userId} joined room ${roomId}`);
  });
  
  // Handle leaving a room
  socket.on('leave:room', (roomId) => {
    socket.leave(roomId);
    console.log(`User ${socket.userId} left room ${roomId}`);
  });
  
  // WebRTC signaling events
  socket.on('webrtc:offer', (data) => {
    // Forward offer to the other participant in the room
    socket.to(data.roomId).emit('webrtc:offer', {
      offer: data.offer,
      from: socket.userId
    });
  });
  
  socket.on('webrtc:answer', (data) => {
    socket.to(data.roomId).emit('webrtc:answer', {
      answer: data.answer,
      from: socket.userId
    });
  });
  
  socket.on('webrtc:ice-candidate', (data) => {
    socket.to(data.roomId).emit('webrtc:ice-candidate', {
      candidate: data.candidate,
      from: socket.userId
    });
  });
  
  // Handle session start
  socket.on('session:start', (data) => {
    socket.to(data.roomId).emit('session:started', {
      startedAt: new Date()
    });
  });
  
  // Handle session end
  socket.on('session:end', (data) => {
    socket.to(data.roomId).emit('session:ended', {
      endedAt: new Date(),
      actualDuration: data.actualDuration
    });
  });
  
  // Handle extension request
  socket.on('session:extend-request', (data) => {
    socket.to(data.roomId).emit('session:extend-request', {
      requestedMinutes: data.minutes,
      cost: data.cost
    });
  });
  
  // Handle extension accepted
  socket.on('session:extend-accepted', (data) => {
    socket.to(data.roomId).emit('session:extend-accepted', {
      additionalMinutes: data.minutes
    });
  });
  
  // Disconnect handler
  socket.on('disconnect', async () => {
    console.log('User disconnected:', socket.userId);
    userSockets.delete(socket.userId);
    await User.findByIdAndUpdate(socket.userId, { isOnline: false, socketId: null });
  });
});

// Helper function to emit to specific user
function emitToUser(userId, event, data) {
  io.to(`user:${userId}`).emit(event, data);
}

// Helper function to emit to room
function emitToRoom(roomId, event, data) {
  io.to(roomId).emit(event, data);
}

module.exports = { io, emitToUser, emitToRoom };
