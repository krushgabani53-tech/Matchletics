# Setup Checklist

Use this checklist to verify your Sports Squad installation.

## ✅ Pre-Installation

- [ ] Python 3.8+ installed (`python --version`)
- [ ] Node.js 16+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Git installed (optional)

## ✅ Backend Setup

### Files Present
- [ ] `backend/main.py`
- [ ] `backend/models.py`
- [ ] `backend/schemas.py`
- [ ] `backend/database.py`
- [ ] `backend/auth.py`
- [ ] `backend/requirements.txt`
- [ ] `backend/.env` (or `.env.example`)
- [ ] `backend/routers/auth.py`
- [ ] `backend/routers/users.py`
- [ ] `backend/routers/events.py` ✨ NEW
- [ ] `backend/routers/messages.py`
- [ ] `backend/routers/dashboard.py`
- [ ] `backend/routers/settings.py`

### Installation Steps
- [ ] Navigate to `backend/` directory
- [ ] Create virtual environment: `python -m venv venv`
- [ ] Activate virtual environment
  - Windows: `venv\Scripts\activate`
  - Mac/Linux: `source venv/bin/activate`
- [ ] Install dependencies: `pip install -r requirements.txt`
- [ ] Copy `.env.example` to `.env` (if needed)
- [ ] Update `.env` with your settings

### Verification
- [ ] Start server: `uvicorn main:app --reload`
- [ ] Server starts without errors
- [ ] Visit http://localhost:8000
- [ ] See: `{"message": "Sports Squad API is running"}`
- [ ] Visit http://localhost:8000/docs
- [ ] Swagger UI loads successfully
- [ ] Database file created: `sports_squad.db`

## ✅ Frontend Setup

### Files Present
- [ ] `frontend/package.json`
- [ ] `frontend/vite.config.js`
- [ ] `frontend/tailwind.config.js`
- [ ] `frontend/index.html`
- [ ] `frontend/.env` (or `.env.example`)
- [ ] `frontend/src/main.jsx`
- [ ] `frontend/src/App.jsx`
- [ ] `frontend/src/context/AppContext.jsx` ✨ UPDATED
- [ ] `frontend/src/services/api.js` ✨ NEW
- [ ] All page components in `frontend/src/pages/`
- [ ] All components in `frontend/src/components/`

### Installation Steps
- [ ] Navigate to `frontend/` directory
- [ ] Install dependencies: `npm install`
- [ ] Copy `.env.example` to `.env` (if needed)
- [ ] Update `.env`: `VITE_API_URL=http://localhost:8000`

### Verification
- [ ] Start dev server: `npm run dev`
- [ ] Server starts without errors
- [ ] Visit http://localhost:5173
- [ ] Landing page loads
- [ ] No console errors (F12)
- [ ] Styles load correctly

## ✅ Integration Testing

### Backend API
- [ ] Open http://localhost:8000/docs
- [ ] Test `POST /api/auth/register`
  - Create test user
  - Receive access token
- [ ] Test `POST /api/auth/login`
  - Login with test user
  - Receive access token
- [ ] Test `GET /api/users/me` (with token)
  - Returns user data
- [ ] Test `GET /api/events`
  - Returns empty array or events
- [ ] Test `POST /api/events` (with token)
  - Create test event
  - Event created successfully

### Frontend Integration
- [ ] Open http://localhost:5173
- [ ] Click "Get Started" or "Login"
- [ ] Register new account
  - Fill form
  - Submit
  - Redirects to discover page
  - User logged in
- [ ] Navigate to Events page
- [ ] Create new event
  - Fill form
  - Submit
  - Event appears in list
- [ ] Navigate to Discover page
- [ ] Search for players
  - Filters work
  - Results display
- [ ] View player profile
  - Profile loads
  - Details display
- [ ] Navigate to Messages
  - Page loads
  - No errors

### Backend ↔ Frontend Communication
- [ ] Backend running on port 8000
- [ ] Frontend running on port 5173
- [ ] CORS enabled (no CORS errors in console)
- [ ] API calls successful (check Network tab)
- [ ] JWT token stored in localStorage
- [ ] Protected routes require authentication
- [ ] Data persists in database

## ✅ Features Working

### Authentication
- [ ] User registration
- [ ] User login
- [ ] User logout
- [ ] JWT token management
- [ ] Protected routes

### Player Discovery
- [ ] View all players
- [ ] Search by name
- [ ] Filter by city
- [ ] Filter by sport
- [ ] Filter by skill level
- [ ] View player profiles

### Events Management ✨ NEW
- [ ] View all events
- [ ] Filter events by city
- [ ] Filter events by sport
- [ ] Create new event
- [ ] Join event
- [ ] Leave event
- [ ] View event participants
- [ ] Update event (organizer)
- [ ] Delete event (organizer)

### Messaging
- [ ] View conversations
- [ ] Send messages
- [ ] Receive messages
- [ ] Message history

### Profile Management
- [ ] View own profile
- [ ] Edit profile
- [ ] Update bio
- [ ] Change city
- [ ] Add/remove sports
- [ ] Update skill level
- [ ] Update availability

### Settings
- [ ] Change password
- [ ] Change email
- [ ] Update notifications
- [ ] Update privacy settings

## ✅ Documentation

- [ ] README.md - Complete documentation
- [ ] QUICKSTART.md - Quick setup guide
- [ ] TESTING.md - Testing procedures
- [ ] IMPLEMENTATION_SUMMARY.md - What was built
- [ ] SETUP_CHECKLIST.md - This file

## ✅ Scripts

- [ ] `start-backend.sh` / `start-backend.bat`
- [ ] `start-frontend.sh` / `start-frontend.bat`

## ✅ Configuration

### Backend
- [ ] `.env` file configured
- [ ] Database URL set
- [ ] JWT secret set
- [ ] CORS origins configured

### Frontend
- [ ] `.env` file configured
- [ ] API URL set correctly
- [ ] Points to backend server

## 🎉 Final Verification

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can register new user
- [ ] Can login
- [ ] Can create event ✨
- [ ] Can join event ✨
- [ ] Can search players
- [ ] Can send messages
- [ ] Can update profile
- [ ] No console errors
- [ ] No API errors
- [ ] Database persists data

## 🚀 Ready to Go!

If all items are checked, your Sports Squad application is fully set up and ready to use!

## 📝 Notes

- Default database: SQLite (no setup required)
- Demo mode available if backend is down
- All passwords hashed with bcrypt
- JWT tokens expire after 24 hours

## 🆘 Troubleshooting

If any checks fail, refer to:
1. README.md - Detailed setup instructions
2. QUICKSTART.md - Quick troubleshooting
3. Backend terminal - Error logs
4. Frontend terminal - Error logs
5. Browser console (F12) - Frontend errors

## 📊 What's New

✨ **Events API** - Complete CRUD operations
✨ **API Integration** - Frontend connected to backend
✨ **Hybrid Mode** - Works with or without backend
✨ **SQLite Support** - Easy database setup
✨ **Comprehensive Docs** - Full documentation suite
