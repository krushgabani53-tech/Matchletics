# API Reference

Complete reference for all Sports Squad API endpoints.

Base URL: `http://localhost:8000`

## Authentication

All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepass123",
  "full_name": "John Doe",
  "city": "Mumbai"
}
```

**Response:** `201 Created`
```json
{
  "message": "User registered successfully",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "full_name": "John Doe",
    "city": "Mumbai"
  }
}
```

### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "securepass123"
}
```

**Response:** `200 OK`
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "full_name": "John Doe",
    "city": "Mumbai"
  }
}
```

---

## 👥 User Endpoints

### Get Current User
```http
GET /api/users/me
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "full_name": "John Doe",
  "city": "Mumbai",
  "bio": "Football enthusiast",
  "avatar": null,
  "created_at": "2026-02-18T10:00:00",
  "email_notifications": true,
  "push_notifications": true,
  "match_suggestions": false,
  "profile_visible": true,
  "show_online_status": true
}
```

### Update Profile
```http
PUT /api/users/me
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "full_name": "John Smith",
  "bio": "Love playing football on weekends",
  "city": "Delhi",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response:** `200 OK` (returns updated user)

### Get User by ID
```http
GET /api/users/{user_id}
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "id": 2,
  "username": "janedoe",
  "email": "jane@example.com",
  "full_name": "Jane Doe",
  "city": "Mumbai",
  "bio": "Tennis player",
  "avatar": null,
  "created_at": "2026-02-17T15:30:00",
  "sports": [
    {
      "id": 1,
      "user_id": 2,
      "sport_name": "tennis",
      "skill_level": "Advanced"
    }
  ]
}
```

### Search Players
```http
GET /api/users?city=Mumbai&sport=football
Authorization: Bearer <token>
```

**Query Parameters:**
- `city` (optional) - Filter by city
- `sport` (optional) - Filter by sport

**Response:** `200 OK` (array of users)

### Add User Sport
```http
POST /api/users/me/sports
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "sport_name": "football",
  "skill_level": "Intermediate"
}
```

**Response:** `201 Created`

### Get User Sports
```http
GET /api/users/me/sports
Authorization: Bearer <token>
```

**Response:** `200 OK` (array of sports)

### Delete User Sport
```http
DELETE /api/users/me/sports/{sport_id}
Authorization: Bearer <token>
```

**Response:** `204 No Content`

---

## 📅 Event Endpoints ✨ NEW

### List Events
```http
GET /api/events?city=Mumbai&sport=football
```

**Query Parameters:**
- `city` (optional) - Filter by city
- `sport` (optional) - Filter by sport

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "title": "Sunday Football League",
    "sport": "football",
    "city": "Mumbai",
    "date": "2026-02-22",
    "time": "07:00",
    "max_players": 22,
    "description": "Weekly 11-a-side match",
    "organizer_id": 1,
    "created_at": "2026-02-18T10:00:00"
  }
]
```

### Create Event
```http
POST /api/events
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Evening Basketball",
  "sport": "basketball",
  "city": "Delhi",
  "date": "2026-02-25",
  "time": "18:00",
  "max_players": 10,
  "description": "Casual 5v5 game"
}
```

**Response:** `201 Created` (returns created event)

### Get Event Details
```http
GET /api/events/{event_id}
```

**Response:** `200 OK` (event object)

### Update Event
```http
PUT /api/events/{event_id}
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "date": "2026-02-26",
  "time": "19:00",
  "max_players": 12
}
```

**Response:** `200 OK` (returns updated event)

**Note:** Only organizer can update

### Delete Event
```http
DELETE /api/events/{event_id}
Authorization: Bearer <token>
```

**Response:** `204 No Content`

**Note:** Only organizer can delete

### Join Event
```http
POST /api/events/{event_id}/join
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "message": "Successfully joined event"
}
```

**Errors:**
- `400` - Already joined or event is full
- `404` - Event not found

### Leave Event
```http
POST /api/events/{event_id}/leave
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "message": "Successfully left event"
}
```

**Errors:**
- `400` - Not a participant or organizer trying to leave
- `404` - Event not found

### Get Event Participants
```http
GET /api/events/{event_id}/participants
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "username": "johndoe",
    "full_name": "John Doe",
    "avatar": null
  },
  {
    "id": 2,
    "username": "janedoe",
    "full_name": "Jane Doe",
    "avatar": null
  }
]
```

---

## 💬 Message Endpoints

### Get All Messages
```http
GET /api/messages
Authorization: Bearer <token>
```

**Response:** `200 OK` (array of messages)

### Send Message
```http
POST /api/messages
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "receiver_id": 2,
  "content": "Hey, want to play football this weekend?"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "sender_id": 1,
  "receiver_id": 2,
  "content": "Hey, want to play football this weekend?",
  "is_read": false,
  "created_at": "2026-02-18T10:30:00",
  "sender_username": "johndoe",
  "receiver_username": "janedoe"
}
```

### Get Conversations
```http
GET /api/messages/conversations
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
[
  {
    "user_id": 2,
    "username": "janedoe",
    "full_name": "Jane Doe",
    "avatar": null,
    "last_message": "Sure, what time?",
    "last_message_time": "2026-02-18T10:35:00",
    "is_sender": false,
    "unread_count": 1
  }
]
```

### Mark Message as Read
```http
PUT /api/messages/{message_id}/read
Authorization: Bearer <token>
```

**Response:** `200 OK` (returns updated message)

---

## 📊 Dashboard Endpoints

### Get User Stats
```http
GET /api/dashboard/stats
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "total_messages_sent": 15,
  "total_messages_received": 23,
  "unread_messages": 3,
  "total_connections": 8
}
```

---

## ⚙️ Settings Endpoints

### Change Password
```http
PUT /api/settings/password
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "current_password": "oldpass123",
  "new_password": "newpass456"
}
```

**Response:** `200 OK`
```json
{
  "message": "Password updated successfully"
}
```

### Change Email
```http
PUT /api/settings/email
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "new_email": "newemail@example.com"
}
```

**Response:** `200 OK`
```json
{
  "message": "Email updated successfully"
}
```

### Update Notification Settings
```http
PUT /api/settings/notifications
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "email_notifications": true,
  "push_notifications": false,
  "match_suggestions": true
}
```

**Response:** `200 OK` (returns updated user)

### Update Privacy Settings
```http
PUT /api/settings/privacy
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "profile_visible": true,
  "show_online_status": false
}
```

**Response:** `200 OK` (returns updated user)

### Delete Account
```http
DELETE /api/settings/account
Authorization: Bearer <token>
```

**Response:** `204 No Content`

---

## 🏥 Health Check

### API Health
```http
GET /health
```

**Response:** `200 OK`
```json
{
  "status": "healthy"
}
```

### Root
```http
GET /
```

**Response:** `200 OK`
```json
{
  "message": "Sports Squad API is running"
}
```

---

## 📝 Error Responses

### 400 Bad Request
```json
{
  "detail": "Invalid input data"
}
```

### 401 Unauthorized
```json
{
  "detail": "Could not validate credentials"
}
```

### 403 Forbidden
```json
{
  "detail": "Not authorized to perform this action"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 422 Validation Error
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "value is not a valid email address",
      "type": "value_error.email"
    }
  ]
}
```

---

## 🔑 Authentication Flow

1. **Register or Login** → Receive JWT token
2. **Store token** in localStorage/sessionStorage
3. **Include token** in Authorization header for protected routes
4. **Token expires** after 24 hours → Login again

---

## 📚 Interactive Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

Both provide interactive API testing!

---

## 💡 Tips

1. Use Swagger UI for testing endpoints
2. JWT tokens expire after 24 hours
3. All dates in ISO 8601 format
4. All timestamps in UTC
5. CORS enabled for frontend integration
6. Rate limiting not implemented (add in production)

---

## 🚀 Quick Test

```bash
# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"test123","full_name":"Test User","city":"Mumbai"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'

# Get Events (no auth required)
curl http://localhost:8000/api/events

# Create Event (requires auth)
curl -X POST http://localhost:8000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"Test Event","sport":"football","city":"Mumbai","date":"2026-03-01","time":"18:00","max_players":10}'
```
