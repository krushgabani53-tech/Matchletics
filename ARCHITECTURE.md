# System Architecture

## Overview

Sports Squad is a full-stack web application built with FastAPI (backend) and React (frontend).

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              React Frontend (Port 5173)                 │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │  UI Components (Pages, Components)               │  │ │
│  │  │  ├─ Landing, Login, Signup                       │  │ │
│  │  │  ├─ Discover, Profile, Events                    │  │ │
│  │  │  └─ Messages, Settings                           │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │  State Management (Context API)                  │  │ │
│  │  │  └─ AppContext (User, Events, Messages)         │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │  API Service Layer                               │  │ │
│  │  │  └─ HTTP Client with JWT Auth                   │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          │ HTTP/JSON
                          │ JWT Bearer Token
                          │
┌─────────────────────────▼───────────────────────────────────┐
│              FastAPI Backend (Port 8000)                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  API Routers                                           │ │
│  │  ├─ /api/auth      (Register, Login)                  │ │
│  │  ├─ /api/users     (Profile, Search, Sports)          │ │
│  │  ├─ /api/events    (CRUD, Join, Leave) ✨ NEW         │ │
│  │  ├─ /api/messages  (Send, Receive, Conversations)     │ │
│  │  ├─ /api/dashboard (Stats)                            │ │
│  │  └─ /api/settings  (Password, Email, Preferences)     │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Middleware                                            │ │
│  │  ├─ CORS (Cross-Origin Resource Sharing)              │ │
│  │  └─ JWT Authentication                                │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Business Logic                                        │ │
│  │  ├─ Authentication (JWT, bcrypt)                      │ │
│  │  ├─ Validation (Pydantic Schemas)                     │ │
│  │  └─ Authorization (User permissions)                  │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Data Access Layer (SQLAlchemy ORM)                   │ │
│  │  └─ Models (User, Event, Message, etc.)              │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          │ SQL Queries
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                  Database (SQLite)                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Tables                                                │ │
│  │  ├─ users                                              │ │
│  │  ├─ user_sports                                        │ │
│  │  ├─ events              ✨ NEW                         │ │
│  │  ├─ event_participants  ✨ NEW                         │ │
│  │  └─ messages                                           │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### Frontend (React + Vite)

#### Pages
```
src/pages/
├── LandingPage.jsx      - Marketing/home page
├── LoginPage.jsx        - User login
├── SignupPage.jsx       - User registration
├── DiscoverPage.jsx     - Player search & discovery
├── ProfilePage.jsx      - View player profiles
├── EditProfilePage.jsx  - Edit own profile
├── EventsPage.jsx       - Browse events
├── CreateEventPage.jsx  - Create new event
└── MessagesPage.jsx     - Chat interface
```

#### Components
```
src/components/
├── Navbar.jsx           - Navigation bar
├── Footer.jsx           - Page footer
├── PlayerCard.jsx       - Player display card
├── EventCard.jsx        - Event display card
├── ChatWindow.jsx       - Message interface
├── SearchBar.jsx        - Search input
├── SportFilter.jsx      - Sport selection
├── CitySelector.jsx     - City dropdown
└── ProtectedRoute.jsx   - Auth guard
```

#### Services
```
src/services/
└── api.js               - API client (HTTP requests)
```

#### Context
```
src/context/
└── AppContext.jsx       - Global state management
```

### Backend (FastAPI)

#### Routers
```
routers/
├── auth.py              - Authentication endpoints
├── users.py             - User management
├── events.py            - Event CRUD ✨ NEW
├── messages.py          - Messaging system
├── dashboard.py         - User statistics
└── settings.py          - User settings
```

#### Models
```
models.py
├── User                 - User accounts
├── UserSport            - User sports & skills
├── Event                - Sports events ✨ NEW
├── EventParticipant     - Event participation ✨ NEW
└── Message              - Direct messages
```

#### Schemas
```
schemas.py
├── UserCreate/Response  - User DTOs
├── EventCreate/Response - Event DTOs ✨ NEW
├── MessageCreate/Response - Message DTOs
└── Settings schemas     - Settings DTOs
```

## Data Flow

### 1. User Registration Flow
```
User Input → Frontend Form → API Service → POST /api/auth/register
                                              ↓
                                         Validate Data
                                              ↓
                                         Hash Password
                                              ↓
                                         Create User
                                              ↓
                                         Generate JWT
                                              ↓
Frontend ← JWT Token + User Data ← Response
    ↓
Store Token
    ↓
Redirect to Discover
```

### 2. Event Creation Flow ✨ NEW
```
User Input → Create Event Form → API Service → POST /api/events
                                                    ↓
                                              Validate JWT
                                                    ↓
                                              Validate Data
                                                    ↓
                                              Create Event
                                                    ↓
                                              Add Organizer as Participant
                                                    ↓
Frontend ← Event Data ← Response
    ↓
Update UI
    ↓
Show Success Message
```

### 3. Player Search Flow
```
User Input → Search/Filter → API Service → GET /api/users?city=X&sport=Y
                                                ↓
                                          Validate JWT
                                                ↓
                                          Query Database
                                                ↓
                                          Filter Results
                                                ↓
Frontend ← Player List ← Response
    ↓
Display Results
```

### 4. Messaging Flow
```
User Types Message → Send → API Service → POST /api/messages
                                              ↓
                                         Validate JWT
                                              ↓
                                         Check Receiver Exists
                                              ↓
                                         Create Message
                                              ↓
Frontend ← Message Data ← Response
    ↓
Update Chat UI
```

## Database Schema

### Users Table
```sql
users
├── id (PK)
├── username (UNIQUE)
├── email (UNIQUE)
├── password_hash
├── full_name
├── city
├── bio
├── avatar
├── created_at
├── email_notifications
├── push_notifications
├── match_suggestions
├── profile_visible
└── show_online_status
```

### User Sports Table
```sql
user_sports
├── id (PK)
├── user_id (FK → users.id)
├── sport_name
└── skill_level
```

### Events Table ✨ NEW
```sql
events
├── id (PK)
├── title
├── sport
├── city
├── date
├── time
├── max_players
├── description
├── organizer_id (FK → users.id)
└── created_at
```

### Event Participants Table ✨ NEW
```sql
event_participants
├── id (PK)
├── event_id (FK → events.id)
├── user_id (FK → users.id)
└── joined_at
```

### Messages Table
```sql
messages
├── id (PK)
├── sender_id (FK → users.id)
├── receiver_id (FK → users.id)
├── content
├── is_read
└── created_at
```

## Authentication Flow

```
┌──────────────┐
│   Register   │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│  Hash Password       │
│  (bcrypt)            │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Create User         │
│  in Database         │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Generate JWT Token  │
│  (python-jose)       │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Return Token        │
│  to Frontend         │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Store in            │
│  localStorage        │
└──────────────────────┘
       │
       ▼
┌──────────────────────┐
│  Include in          │
│  Authorization       │
│  Header              │
└──────────────────────┘
```

## Security Layers

1. **Password Security**
   - bcrypt hashing
   - Salt generation
   - No plain text storage

2. **JWT Authentication**
   - Token-based auth
   - 24-hour expiration
   - Secure secret key

3. **API Security**
   - Protected routes
   - User authorization
   - Input validation

4. **Database Security**
   - Parameterized queries (SQLAlchemy)
   - Foreign key constraints
   - Cascade deletes

5. **Frontend Security**
   - Protected routes
   - Token validation
   - XSS prevention (React)

## Scalability Considerations

### Current Setup (Development)
- SQLite database
- Single server
- No caching
- No load balancing

### Production Recommendations
1. **Database**
   - PostgreSQL for production
   - Connection pooling
   - Database indexing
   - Regular backups

2. **Caching**
   - Redis for sessions
   - Cache frequent queries
   - CDN for static assets

3. **Infrastructure**
   - Load balancer
   - Multiple app instances
   - Separate DB server
   - Message queue (Celery)

4. **Monitoring**
   - Application logs
   - Error tracking (Sentry)
   - Performance monitoring
   - Uptime monitoring

## Technology Stack

### Frontend
- **Framework**: React 19.0.0
- **Build Tool**: Vite 6.0.0
- **Routing**: React Router 7.1.1
- **Styling**: TailwindCSS 3.4.17
- **Icons**: Lucide React 0.469.0
- **HTTP Client**: Fetch API

### Backend
- **Framework**: FastAPI 0.109.0
- **Server**: Uvicorn 0.27.0
- **ORM**: SQLAlchemy 2.0.25
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **Auth**: python-jose 3.3.0 + bcrypt 4.1.2
- **Validation**: Pydantic 2.5.3

### DevOps
- **Version Control**: Git
- **Package Managers**: npm, pip
- **Environment**: .env files
- **Documentation**: Markdown

## Deployment Architecture (Recommended)

```
┌─────────────────────────────────────────────────────────┐
│                    Load Balancer                         │
│                    (nginx/AWS ALB)                       │
└────────────┬────────────────────────────┬────────────────┘
             │                            │
    ┌────────▼────────┐          ┌───────▼────────┐
    │  Frontend CDN   │          │  API Server 1  │
    │  (Static Files) │          │  (FastAPI)     │
    └─────────────────┘          └───────┬────────┘
                                         │
                                 ┌───────▼────────┐
                                 │  API Server 2  │
                                 │  (FastAPI)     │
                                 └───────┬────────┘
                                         │
                                 ┌───────▼────────┐
                                 │   PostgreSQL   │
                                 │   (Primary)    │
                                 └───────┬────────┘
                                         │
                                 ┌───────▼────────┐
                                 │   PostgreSQL   │
                                 │   (Replica)    │
                                 └────────────────┘
```

## Performance Metrics

### Target Metrics
- API Response Time: < 200ms
- Page Load Time: < 1s
- Database Query Time: < 50ms
- JWT Validation: < 10ms

### Optimization Strategies
1. Database indexing on frequently queried fields
2. Query optimization (eager loading)
3. Response caching
4. Image optimization
5. Code splitting (frontend)
6. Lazy loading components

## Conclusion

The architecture is designed for:
- ✅ Scalability
- ✅ Maintainability
- ✅ Security
- ✅ Performance
- ✅ Developer experience

The modular design allows easy addition of new features and services.
