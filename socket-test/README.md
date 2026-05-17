# GuruConnect - Video Session System

## What's New?

We've replaced Zoom API with our own **WebSocket-based video session system** that allows:
- ✅ Real-time video calls between mentor and student
- ✅ Built-in timer with session duration tracking
- ✅ Session extension with additional charges
- ✅ No external dependencies (Zoom API no longer required)
- ✅ Free to use - no API costs

## Project Structure

```
GuruConnect/
├── BACKEND/
│   ├── server.js                    # Main server with Socket.io
│   └── src/
│       ├── socket/
│       │   └── index.js            # WebSocket server setup
│       ├── controllers/
│       │   └── bookingController.js # Updated to use WebSocket rooms
│       └── models/
│           └── booking.js          # Booking model (meetingLink now = room ID)
│
├── Frontend/
│   └── src/
│       ├── hooks/
│       │   └── useSocket.jsx       # Socket.io client hook
│       └── components/
│           └── VideoSessionRoom.jsx # Video session component
│
└── socket-test/
    └── test-session.html           # Test page to verify video calls work
```

## Installation

### 1. Install Dependencies

```bash
# Backend
cd BACKEND
npm install socket.io socket.io-client

# Frontend
cd Frontend
npm install socket.io-client
```

## How It Works

### 1. **Backend (Socket.io Server)**

The WebSocket server handles:
- User connections and room management
- WebRTC signaling (offer/answer/ICE candidates)
- Session lifecycle (start, end, extend)
- Real-time notifications

**Key file:** `BACKEND/src/socket/index.js`

### 2. **Frontend (Socket.io Client)**

React components connect to the WebSocket server and handle:
- Video/audio streaming (WebRTC)
- Session controls (mute, video toggle, end call)
- Timer countdown and extension prompts
- Real-time communication with the other participant

**Key file:** `Frontend/src/components/VideoSessionRoom.jsx`

### 3. **Booking System Integration**

The existing booking system now generates:
- **Room ID** instead of Zoom meeting links
- Example: `room_64f1a2b3c4d5e6f7a8b9c0d1`

## Testing the Video Session

### Quick Test

1. **Start the backend:**
   ```bash
   cd BACKEND
   npm start
   ```

2. **Open the test page:**
   - Open `socket-test/test-session.html` in your browser
   - Or start a local server:
     ```bash
     cd socket-test
     python -m http.server 8080
     ```
   - Visit: `http://localhost:8080/test-session.html`

3. **Test with two browser tabs:**
   - Tab 1: Enter Room ID `room_test123` and click "Connect"
   - Tab 2: Enter the same Room ID `room_test123` and click "Connect"
   - Tab 1: Click "Start Session"
   - Both tabs should see each other's video!

## How to Use in Your App

### 1. Wrap Your App with SocketProvider

```jsx
// In your main App.jsx
import { SocketProvider } from './hooks/useSocket';

function App() {
  const userId = 'user-123'; // Get from your auth system
  const userType = 'candidate'; // or 'mentor'

  return (
    <SocketProvider userId={userId} userType={userType}>
      <YourRoutes />
    </SocketProvider>
  );
}
```

### 2. Use the Video Session Room

```jsx
import VideoSessionRoom from './components/VideoSessionRoom';

function BookingDetailPage({ booking }) {
  const handleSessionEnd = (actualDuration) => {
    console.log('Session ended. Duration:', actualDuration);
    // Redirect to feedback page or booking summary
  };

  return (
    <VideoSessionRoom
      booking={booking}
      currentUserId={userId}
      onSessionEnd={handleSessionEnd}
    />
  );
}
```

## Features

### Session Timer
- Countdown timer shows remaining session time
- Warning (red) when less than 1 minute remaining
- Automatic extension prompt when time expires

### Extension System
- Prompt appears when time runs out
- Options to extend by 15, 30, or 60 minutes
- Cost: ₹10 per minute (configurable)
- Both participants must agree to continue

### Controls
- **Mute/Unmute** - Toggle microphone
- **Video On/Off** - Toggle camera
- **End Call** - End the session
- All controls work in real-time for both participants

### WebRTC Setup
- Uses STUN servers for NAT traversal
- Peer-to-peer connection (no media server needed)
- Works for 1-on-1 sessions
- For group sessions (future), you'll need an SFU like mediasoup

## Socket Events

### Client → Server
- `join:room` - Join a booking room
- `leave:room` - Leave a room
- `webrtc:offer` - Send WebRTC offer
- `webrtc:answer` - Send WebRTC answer
- `webrtc:ice-candidate` - Send ICE candidate
- `session:start` - Notify session started
- `session:end` - Notify session ended
- `session:extend-request` - Request extension
- `session:extend-accepted` - Accept extension

### Server → Client
- Same events forwarded to other room participants

## Troubleshooting

### Camera/Microphone Not Working
1. Check browser permissions
2. Ensure HTTPS (required for getUserMedia)
3. Try a different browser (Chrome recommended)

### Video Not Connecting
1. Check if both users are in the same room
2. Verify WebSocket connection is established
3. Check browser console for ICE errors
4. Ensure both users have good internet connection

### Socket Connection Issues
1. Verify backend is running on port 5000
2. Check CORS settings in `BACKEND/src/socket/index.js`
3. Ensure no firewall blocking WebSocket connections

## Future Enhancements

- [ ] **Group Sessions** - Support multiple participants (requires SFU)
- [ ] **Screen Sharing** - Share screen during session
- [ ] **Session Recording** - Record sessions for review
- [ ] **Chat During Session** - Text chat alongside video
- [ ] **File Sharing** - Share documents during session
- [ ] **Virtual Background** - Customize video background
- [ ] **Poor Network Handling** - Adaptive video quality

## Configuration

### Change Extension Cost
In `Frontend/src/components/VideoSessionRoom.jsx`, modify:
```javascript
const EXTENSION_COST_PER_MINUTE = 10; // ₹10 per minute
```

### Change Default Duration
In `Frontend/src/components/VideoSessionRoom.jsx`:
```javascript
const [timeRemaining, setTimeRemaining] = useState(booking.duration * 60);
```

### Add TURN Server (for better NAT traversal)
In `BACKEND/src/socket/index.js`:
```javascript
const config = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'turn:your-turn-server.com:3478', // Add your TURN server
      username: 'user',
      credential: 'password' }
  ]
};
```

## Support

For issues or questions:
1. Check the browser console for error messages
2. Verify all dependencies are installed
3. Ensure MongoDB is running
4. Check that backend and frontend are on correct ports

## Credits

Built with:
- Socket.io for real-time communication
- WebRTC for peer-to-peer video streaming
- React for the frontend
- Node.js for the backend
