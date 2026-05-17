# Setup Instructions for Running GuruConnect

## Prerequisites
- Node.js (v18+)
- MongoDB (local or cloud)

## Backend Setup
```bash
cd BACKEND
cp .env.example .env
# Edit .env with your values
npm install
npm run dev
```

## Frontend Setup
```bash
cd Frontend
cp .env.example .env
# Edit .env if needed
npm install
npm run dev
```

## Important Notes
- Create a `.env` file in BACKEND folder with actual values before running
- MongoDB must be running locally or use MongoDB Atlas
- You'll need your own API keys (Razorpay, Zoom, Gemini) for features to work