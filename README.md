# GuruConnect

A full-stack platform connecting mentors and candidates for skill development and mentorship sessions.

## Features

- **Mentor Discovery**: Browse and search mentors by skills, experience, and ratings
- **Booking System**: Schedule one-on-one sessions with mentors
- **Video Sessions**: Integrated video calls for mentorship meetings
- **Real-time Chat**: Socket.io based messaging between mentors and candidates
- **AI Evaluation**: Gemini-powered assessment for candidate skills
- **Dashboard**: Separate dashboards for mentors and candidates
- **Profile Management**: Update profile, skills, and availability

## Tech Stack

### Backend
- Node.js & Express
- MongoDB (Mongoose ODM)
- Socket.io (Real-time communication)
- JWT Authentication
- Razorpay (Payment integration)
- Google Gemini AI

### Frontend
- React + Vite
- Tailwind CSS
- Framer Motion (Animations)
- Socket.io Client
- React Router

## Project Structure

```
GuruConnect/
├── BACKEND/
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   ├── middlewares/     # Auth & other middleware
│   │   ├── services/        # Business logic
│   │   ├── socket/         # Socket.io handlers
│   │   └── utils/          # Utilities
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/  # React components
│   │   │   ├── hooks/      # Custom hooks
│   │   │   ├── pages/     # Page components
│   │   │   ├── services/  # API services
│   │   │   └── store/     # State management
│   │   └── components/ui/ # UI components
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd GuruConnect
```

2. Install Backend dependencies
```bash
cd BACKEND
npm install
```

3. Create `.env` file in BACKEND
```env
PORT=5002
MONGODB_URI=mongodb://localhost:27017/guruconnect
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

4. Install Frontend dependencies
```bash
cd ../Frontend
npm install
```

5. Create `.env` file in Frontend
```env
VITE_API_URL=http://localhost:5002
```

### Running the Application

**Backend:**
```bash
cd BACKEND
npm run dev
```

**Frontend:**
```bash
cd Frontend
npm run dev
```

The frontend will run on `http://localhost:5173` and backend on `http://localhost:5002`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Mentors
- `GET /api/mentors` - Get all mentors
- `GET /api/mentors/:id` - Get mentor by ID
- `PUT /api/mentors/profile` - Update mentor profile
- `GET /api/mentors/slots` - Get available slots
- `POST /api/mentors/slots` - Add time slots

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `PUT /api/bookings/:id/status` - Update booking status

### Chat
- `POST /api/chat/conversation` - Create/get conversation
- `GET /api/chat/conversations` - Get all conversations
- `GET /api/chat/messages/:conversationId` - Get messages

## License

ISC