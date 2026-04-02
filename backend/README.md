# Sports Squad FastAPI Backend

Complete FastAPI backend with JWT authentication and PostgreSQL database.

## Features

- JWT Authentication
- PostgreSQL Database
- User Management
- Messaging System
- Player Search by City/Sport
- Settings Management
- Dashboard Statistics

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Setup PostgreSQL

Create a PostgreSQL database:

```sql
CREATE DATABASE sports_squad;
```

### 3. Configure Environment

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/sports_squad
SECRET_KEY=your-secret-key-here
```

Generate a secure secret key:

```bash
openssl rand -hex 32
```

### 4. Run the Application

```bash
uvicorn main:app --reload --port 8000
```

The API will be available at: http://localhost:8000

API Documentation: http://localhost:8000/docs

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update profile
- `GET /api/users/{user_id}` - Get user by ID
- `GET /api/users/` - Search players (query params: city, sport)
- `POST /api/users/me/sports` - Add sport to profile
- `GET /api/users/me/sports` - Get user sports
- `DELETE /api/users/me/sports/{sport_id}` - Remove sport

### Messages
- `POST /api/messages/` - Send message
- `GET /api/messages/` - Get all messages
- `GET /api/messages/conversations` - Get conversations list
- `PUT /api/messages/{message_id}/read` - Mark as read

### Dashboard
- `GET /api/dashboard/stats` - Get user statistics

### Settings
- `PUT /api/settings/password` - Change password
- `PUT /api/settings/email` - Change email
- `PUT /api/settings/notifications` - Update notification settings
- `PUT /api/settings/privacy` - Update privacy settings
- `DELETE /api/settings/account` - Delete account

## Project Structure

```
fastapi_backend/
├── main.py              # FastAPI app and configuration
├── database.py          # Database connection
├── models.py            # SQLAlchemy models
├── schemas.py           # Pydantic schemas
├── auth.py              # JWT authentication
├── routers/             # API route handlers
│   ├── auth.py
│   ├── users.py
│   ├── messages.py
│   ├── dashboard.py
│   └── settings.py
├── requirements.txt     # Python dependencies
├── .env.example         # Environment variables template
└── README.md
```

## Frontend Integration

Update your frontend `config.js`:

```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

The API uses JWT tokens in the Authorization header:

```javascript
headers: {
    'Authorization': `Bearer ${token}`
}
```

## Database Models

### User
- id, username, email, password_hash
- full_name, city, bio, avatar
- Settings: email_notifications, push_notifications, etc.

### UserSport
- id, user_id, sport_name, skill_level

### Message
- id, sender_id, receiver_id, content
- is_read, created_at

## Development

Run with auto-reload:

```bash
uvicorn main:app --reload --port 8000
```

View API docs:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Production Deployment

1. Set strong SECRET_KEY
2. Use production PostgreSQL database
3. Set proper CORS origins in main.py
4. Use HTTPS
5. Run with gunicorn:

```bash
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```
