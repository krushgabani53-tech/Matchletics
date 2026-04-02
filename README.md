# Matchletics

A full-stack web application for connecting local sports enthusiasts. Find nearby players, organize events, and build your sports community.

## Quick Links

- [Get Started in 5 Minutes](QUICKSTART.md)
- [API Documentation](API_REFERENCE.md)
- [System Architecture](ARCHITECTURE.md)
- [Testing Guide](TESTING.md)
- [Documentation Index](DOCUMENTATION_INDEX.md)

## What's New

- Complete Events API implemented
- Frontend integrated with backend
- Hybrid mode with API and demo fallback
- Comprehensive documentation
- One-command startup scripts

## Features

- User authentication for register and login
- Discover players by city, sport, and skill level
- Create and join sports events
- Real-time messaging between players
- User profiles with sports preferences
- Advanced filtering and search
- Dashboard with stats

## Tech Stack

### Backend
- FastAPI with Python
- SQLAlchemy ORM
- SQLite database
- JWT authentication
- Pydantic schemas

### Frontend
- React 18
- Vite
- TailwindCSS
- React Router
- Context API

## Project Structure

```
├── backend/
│   ├── routers/          # API endpoints
│   │   ├── auth.py       # Authentication
│   │   ├── users.py      # User management
│   │   ├── events.py     # Events CRUD
│   │   ├── messages.py   # Messaging
│   │   ├── dashboard.py  # Stats
│   │   └── settings.py   # User settings
│   ├── models.py         # Database models
│   ├── schemas.py        # Pydantic schemas
│   ├── database.py       # DB connection
│   ├── auth.py           # Auth utilities
│   └── main.py           # FastAPI app
│
└── frontend/
    ├── src/
    │   ├── components/   # React components
    │   ├── pages/        # Page components
    │   ├── context/      # Context providers
    │   ├── services/     # API service
    │   └── data/         # Seed data
    └── public/           # Static assets
```

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn
- PostgreSQL 12+ installed and running

### Backend Setup

Important: Ensure PostgreSQL is running and the database exists. See [DATABASE_SETUP.md](DATABASE_SETUP.md) for detailed database setup.

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
- Windows: `venv\Scripts\activate`
- Mac/Linux: `source venv/bin/activate`

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Create a `.env` file:
```bash
copy .env.example .env
```

6. Update `.env` with your settings:
```env
DATABASE_URL=postgresql://postgres:IT@localhost:5432/flask_db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

7. Run the backend:
```bash
uvicorn main:app --reload
```

Backend will run on http://localhost:8000.

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
copy .env.example .env
```

4. Update `.env`:
```env
VITE_API_URL=http://localhost:8000
```

5. Run the frontend:
```bash
npm run dev
```

Frontend will run on http://localhost:5173.

## API Documentation

Once the backend is running, visit:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user

### Users
- GET /api/users/me - Get current user
- PUT /api/users/me - Update profile
- GET /api/users/{id} - Get user by ID
- GET /api/users - Search players
- POST /api/users/me/sports - Add sport
- GET /api/users/me/sports - Get user sports
- DELETE /api/users/me/sports/{id} - Remove sport

### Events
- GET /api/events - List events, filtered by city or sport
- POST /api/events - Create event
- GET /api/events/{id} - Get event details
- PUT /api/events/{id} - Update event
- DELETE /api/events/{id} - Delete event
- POST /api/events/{id}/join - Join event
- POST /api/events/{id}/leave - Leave event
- GET /api/events/{id}/participants - Get participants

### Messages
- GET /api/messages - Get all messages
- POST /api/messages - Send message
- GET /api/messages/conversations - Get conversations
- PUT /api/messages/{id}/read - Mark as read

### Dashboard
- GET /api/dashboard/stats - Get user stats

### Settings
- PUT /api/settings/password - Change password
- PUT /api/settings/email - Change email
- PUT /api/settings/notifications - Update notifications
- PUT /api/settings/privacy - Update privacy
- DELETE /api/settings/account - Delete account

## Demo Mode

The app supports demo mode with seed data when the backend is not available. It automatically falls back to localStorage-based state management.

Demo credentials:

- Email: arjun@playmate.app
- Password: demo123

## Development

### Backend Development
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### Build for Production

Frontend:
```bash
cd frontend
npm run build
```

## Database

The app uses PostgreSQL. Ensure PostgreSQL is installed and running.

**Database Setup:**
1. Create database: `CREATE DATABASE flask_db;`
2. Update `.env` with your credentials
3. Start backend; tables are created automatically

See [DATABASE_SETUP.md](DATABASE_SETUP.md) for detailed instructions.

**Connection String:**
```env
postgresql://postgres:IT@localhost:5432/flask_db
```

## Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://postgres:IT@localhost:5432/flask_db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
```

## Troubleshooting

### Backend Issues
- Ensure the Python virtual environment is activated
- Check whether port 8000 is available
- Verify all dependencies are installed
- Ensure PostgreSQL is running
- Verify the database `flask_db` exists
- Check the database connection in `.env`
- See [DATABASE_SETUP.md](DATABASE_SETUP.md)

### Frontend Issues
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check whether port 5173 is available
- Verify the `.env` file exists with the correct API URL
- Clear browser cache

### CORS Issues
- Backend CORS is configured to allow all origins in development
- For production, update `allow_origins` in `main.py`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Open a pull request

## License

MIT License
