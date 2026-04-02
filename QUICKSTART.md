# Quick Start Guide

Get Sports Squad running in 5 minutes!

## Prerequisites

- Python 3.8+ installed
- Node.js 16+ installed
- Git (optional)
- PostgreSQL installed and running

## Option 1: Automated Start (Recommended)

### Windows
1. Double-click `start-backend.bat` to start the backend
2. Double-click `start-frontend.bat` to start the frontend

### Mac/Linux
```bash
chmod +x start-backend.sh start-frontend.sh
./start-backend.sh &
./start-frontend.sh
```

## Option 2: Manual Start

### Step 1: Start Backend (Terminal 1)

**Important:** Make sure PostgreSQL is running and database `flask_db` exists!
See [DATABASE_SETUP.md](DATABASE_SETUP.md) for database setup.

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start server
uvicorn main:app --reload
```

Backend runs on: http://localhost:8000

### Step 2: Start Frontend (Terminal 2)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs on: http://localhost:5173

## Access the Application

1. Open browser: http://localhost:5173
2. Try demo login:
   - Email: `arjun@playmate.app`
   - Password: `demo123`

Or register a new account!

## API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## What's Working?

✅ User Registration & Login
✅ Player Discovery (search by city, sport, skill)
✅ Events Management (create, join, leave)
✅ Messaging System
✅ Profile Management
✅ Dashboard Stats
✅ Settings (password, email, notifications, privacy)

## Demo Accounts

All demo accounts use password: `demo123`

- arjun@playmate.app - Mumbai, Football & Cricket
- priya@playmate.app - Mumbai, Badminton & Tennis
- rahul@playmate.app - Delhi, Cricket & Basketball
- sneha@playmate.app - Bangalore, Football & Volleyball

## Troubleshooting

### Backend won't start
- Check Python version: `python --version` (need 3.8+)
- Try: `pip install --upgrade pip`
- Delete `venv` folder and recreate

### Frontend won't start
- Check Node version: `node --version` (need 16+)
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

### Port already in use
- Backend: Change port in command: `uvicorn main:app --reload --port 8001`
- Frontend: Change port in `vite.config.js`

### Database errors
- Ensure PostgreSQL is running
- Verify database `flask_db` exists
- Check connection credentials in `.env`
- See [DATABASE_SETUP.md](DATABASE_SETUP.md) for detailed setup

## Next Steps

1. Explore the API docs at http://localhost:8000/docs
2. Check out the full README.md for detailed documentation
3. Customize the app for your needs!

## Support

Having issues? Check:
1. README.md - Full documentation
2. Backend logs in terminal 1
3. Frontend logs in terminal 2
4. Browser console (F12)

Happy coding! 🚀
