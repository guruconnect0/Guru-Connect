require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');

// Setup App
const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Create server and bind socket io
const server = http.createServer(app);
const { io } = require('./socket');
io.attach(server);

// Map routes
const bookingRoutes = require('./routes/bookingRoutes');
app.use('/api/bookings', bookingRoutes);

// Simple mock route for session-types since SessionBooking calls it
const SessionType = require('./models/SessionType');
app.get('/api/session-types', async (req, res) => {
  const types = await SessionType.find();
  res.json(types);
});

const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    // Ensure default session types exist
    await SessionType.createDefaults();
    console.log('Ensured default session types');
    
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Mongo connection error:', err);
  });
