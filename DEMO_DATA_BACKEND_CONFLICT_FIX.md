# Demo Data vs Backend Data Conflict Fix

## Issues
After successful login:
1. **Join Event fails with 422**: Trying to join demo events (ID: "e2") that don't exist in backend
2. **Send Message fails with 422**: Trying to message demo players (ID: "p1") that don't exist in backend

## Root Cause
After login/signup, the app was in "backend mode" (`useBackend = true`) but still had demo data (SEED_EVENTS, SEED_PLAYERS) in state. When users tried to interact with this demo data, the frontend sent demo IDs (strings like "e2", "p1") to the backend, which expects integer IDs from the database.

### What Was Happening:
1. User logs in successfully ✅
2. `useBackend` set to `true` ✅
3. But `events` and `players` state still contained demo data ❌
4. User clicks "Join Event" on demo event with ID "e2"
5. Frontend sends `POST /api/events/e2/join`
6. Backend expects integer ID, gets string "e2" → 422 Unprocessable Entity

## Solution
Load backend data (real events and players from database) immediately after successful login/signup.

### Changes Made

**frontend/src/context/AppContext.jsx**

#### 1. Login Function
```javascript
const login = async (email, password) => {
    try {
        const response = await api.login(email, password);
        const completeUser = await api.getCurrentUser();
        
        // ... normalize user data ...
        
        setCurrentUser(normalizedUser);
        setUseBackend(true);
        
        // Load backend data (players and events) after successful login
        await loadBackendData();  // ← ADDED THIS
        
        return { success: true };
    } catch (error) {
        // ... fallback to demo mode ...
    }
};
```

#### 2. Signup Function
```javascript
const signup = async (userData) => {
    try {
        const response = await api.register({...});
        
        // ... save sports, bio, etc ...
        
        setCurrentUser(normalizedUser);
        setUseBackend(true);
        
        // Load backend data (players and events) after successful signup
        await loadBackendData();  // ← ADDED THIS
        
        return { success: true };
    } catch (error) {
        // ... error handling ...
    }
};
```

### What `loadBackendData()` Does
```javascript
const loadBackendData = async () => {
    try {
        const [playersData, eventsData] = await Promise.all([
            api.searchPlayers(),  // Fetch real players from database
            api.getEvents(),      // Fetch real events from database
        ]);
        setPlayers(playersData);  // Replace demo players
        setEvents(eventsData);    // Replace demo events
    } catch (error) {
        console.error('Failed to load backend data:', error);
    }
};
```

## Expected Behavior After Fix

### Before Fix:
- Login → See demo events (e1, e2, e3) with string IDs
- Click "Join Event" → 422 error (backend doesn't recognize "e2")
- Click "Message Player" → 422 error (backend doesn't recognize "p1")

### After Fix:
- Login → `loadBackendData()` called
- Demo data replaced with real database data
- See real events from database with integer IDs (1, 2, 3)
- Click "Join Event" → Works! (sends integer ID to backend)
- Click "Message Player" → Works! (sends integer user ID to backend)

## How to Apply Fix

### 1. Restart Frontend
The frontend code has been updated, so restart it:
```cmd
cd frontend
npm run dev
```

### 2. Test the Fix
1. **Login** with existing account (e.g., arjun@gmail.com)
2. **Check Discover page** - should show real events from database (or empty if no events)
3. **Create an event** to test
4. **Try to join the event** - should work without 422 errors
5. **Try to message a player** - should work without 422 errors

### 3. Create Test Data
If database is empty, create some test data:

**Create an Event:**
1. Go to "Create Event" page
2. Fill in details:
   - Title: "Weekend Cricket Match"
   - Sport: Cricket
   - City: Mumbai
   - Date: Tomorrow
   - Time: 10:00 AM
   - Max Players: 10
   - Description: "Looking for players!"
3. Submit

**The event will now have a real database ID (integer) and can be joined!**

## Why This Matters

### Data Type Mismatch
- **Demo IDs**: Strings ("e1", "e2", "p1", "p2")
- **Backend IDs**: Integers (1, 2, 3, 4)

FastAPI's Pydantic validation rejects string IDs when integers are expected:
```python
# Backend expects:
@router.post("/{event_id}/join")
def join_event(event_id: int, ...):  # ← Expects integer
    ...

# Frontend was sending:
POST /api/events/e2/join  # ← String "e2" fails validation
```

### Solution
By loading backend data after login, we ensure:
- All event IDs are integers from database
- All user IDs are integers from database
- All API calls use correct data types
- No more 422 validation errors

## Related Files
- `frontend/src/context/AppContext.jsx` - Updated login() and signup()
- `frontend/src/data/seedData.js` - Demo data (only used when not logged in)

## Testing Checklist
- [x] Login loads backend data
- [x] Signup loads backend data
- [ ] Join event works (no 422 error)
- [ ] Leave event works
- [ ] Send message works (no 422 error)
- [ ] View player profile works
- [ ] Create event works
- [ ] All IDs are integers, not strings

## Notes
- Demo data is still used when NOT logged in (for preview/demo purposes)
- Once logged in, all data comes from backend database
- If database is empty, pages will show "No events found" etc. (which is correct)
