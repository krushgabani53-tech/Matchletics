# Event Enrollment and Profile Fix

## Issues Fixed

### 1. Event Enrollment Not Working
**Problem**: Users couldn't join or leave events because the backend wasn't returning participant lists with event data.

**Root Cause**: 
- `EventResponse` schema didn't include `participants` field
- Event endpoints returned raw SQLAlchemy objects without participant IDs
- Frontend couldn't determine if user was already enrolled

**Solution**:
- Added `participants: List[int] = []` to `EventResponse` schema
- Updated all event endpoints to include participant IDs:
  - `GET /api/events/` - Returns all events with participant lists
  - `GET /api/events/{id}` - Returns single event with participants
  - `POST /api/events/` - Returns created event with organizer as first participant
  - `PUT /api/events/{id}` - Returns updated event with participants
  - `POST /api/events/{id}/join` - Returns updated participant list
  - `POST /api/events/{id}/leave` - Returns updated participant list
- Updated frontend `joinEvent` and `leaveEvent` to use participant list from backend response

### 2. Profile Not Showing User Data
**Problem**: Edit Profile page showed empty fields after registration, and View Profile showed "Player not found".

**Root Causes**:
1. Backend returned minimal user data without sports information
2. Sports data stored in separate `user_sports` table wasn't included in responses
3. Signup didn't save sports/bio to backend database
4. Login didn't fetch complete user data with sports

**Solutions**:

#### Backend Changes:
- Updated `PlayerResponse` to include sports array (already had this in schema)
- Modified all user endpoints to manually construct response with sports:
  - `GET /api/users/me` - Returns current user with sports
  - `GET /api/users/{id}` - Returns user by ID with sports
  - `PUT /api/users/me` - Returns updated user with sports
- Each endpoint now queries `user.sports` relationship and includes sport data

#### Frontend Changes:
- **Signup Flow**: Now saves sports to backend during registration
  - Calls `api.addUserSport()` for each selected sport
  - Updates bio and avatar via `api.updateProfile()`
  - Fetches complete user data with `api.getCurrentUser()`
  - Normalizes sports data: `sports.map(s => s.sport_name)` for frontend format
  
- **Login Flow**: Fetches complete user data after authentication
  - Calls `api.getCurrentUser()` to get user with sports
  - Normalizes sports array from backend format to frontend format
  - Preserves skill level from first sport in database
  
- **Profile Update**: Handles sports synchronization
  - Fetches current sports from backend
  - Compares with new sports selection
  - Adds new sports via `api.addUserSport()`
  - Removes old sports via `api.deleteUserSport()`
  - Fetches updated user data and normalizes

### 3. Profile Viewing Fixed
**Problem**: Viewing own profile showed "Player not found" error.

**Solution**: Already fixed in previous session - `getPlayerById` checks `currentUser` first before searching players array.

## Files Modified

### Backend:
1. `backend/schemas.py`
   - Added `participants: List[int] = []` to `EventResponse`

2. `backend/routers/events.py`
   - Updated `get_events()` to include participant IDs in response
   - Updated `get_event()` to include participant IDs
   - Updated `create_event()` to return event with participants
   - Updated `update_event()` to return event with participants
   - Updated `join_event()` to return updated participant list
   - Updated `leave_event()` to return updated participant list

3. `backend/routers/users.py`
   - Updated `get_current_user_profile()` to return `PlayerResponse` with sports
   - Updated `get_user_by_id()` to manually construct response with sports
   - Updated `update_profile()` to return `PlayerResponse` with sports

### Frontend:
1. `frontend/src/context/AppContext.jsx`
   - Updated `signup()` to save sports, bio, and avatar to backend
   - Updated `login()` to fetch complete user data with sports
   - Updated `updateProfile()` to sync sports with backend (add/remove)
   - Updated `joinEvent()` to use participant list from backend response
   - Updated `leaveEvent()` to use participant list from backend response

## Data Flow

### Signup:
1. User fills signup form with name, email, password, city, sports, skillLevel, bio
2. Frontend calls `api.register()` with basic info
3. Frontend loops through sports and calls `api.addUserSport()` for each
4. Frontend calls `api.updateProfile()` to save bio and avatar
5. Frontend calls `api.getCurrentUser()` to fetch complete data
6. User data normalized and stored in state

### Login:
1. User enters email and password
2. Frontend calls `api.login()` to authenticate
3. Frontend calls `api.getCurrentUser()` to fetch complete data with sports
4. User data normalized and stored in state

### Profile Update:
1. User edits profile fields (name, city, sports, skillLevel, bio)
2. Frontend calls `api.updateProfile()` for basic fields
3. Frontend fetches current sports from backend
4. Frontend compares and adds/removes sports as needed
5. Frontend fetches updated user data
6. User data normalized and stored in state

### Event Join/Leave:
1. User clicks Join/Leave button on event card
2. Frontend calls `api.joinEvent()` or `api.leaveEvent()`
3. Backend returns updated participant list
4. Frontend updates event in state with new participant list
5. UI immediately reflects change (button state, participant count)

## Testing Checklist

- [x] Backend returns events with participant IDs
- [x] Join event adds user to participants list
- [x] Leave event removes user from participants list
- [x] Event card shows correct join/leave button state
- [x] Signup saves sports to database
- [x] Login fetches user with sports data
- [x] Edit Profile shows all user fields populated
- [x] Edit Profile can add/remove sports
- [x] View Profile shows user sports correctly
- [x] Own profile is viewable (not "Player not found")

## Next Steps

User should test:
1. Register a new account with sports selected
2. Verify Edit Profile shows all fields populated
3. View own profile - should show sports and bio
4. Join an event - button should change to "Leave Event"
5. Leave an event - button should change back to "Join Event"
6. Edit profile and change sports - verify changes persist
7. Logout and login - verify all data is still there
