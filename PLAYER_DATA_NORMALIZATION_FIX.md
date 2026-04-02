# Player Data Normalization Fix

## Issue
Discover page crashed with error:
```
TypeError: Cannot read properties of undefined (reading 'slice')
at PlayerCard line 20
```

## Root Cause
Backend returns player data with different field structure than frontend expects:

### Backend Returns (PlayerResponse):
```javascript
{
  id: 4,
  username: "arjun",
  email: "arjun@gmail.com",
  full_name: "arjun",
  city: "Mumbai",
  bio: "...",
  avatar: "...",
  sports: [
    { id: 1, sport_name: "cricket", skill_level: "Beginner" }
  ],
  // NO availability field
  // NO matchesPlayed field
  // NO eventsJoined field
}
```

### Frontend Expects:
```javascript
{
  id: 4,
  name: "arjun",  // ← Different field name
  email: "arjun@gmail.com",
  username: "arjun",
  city: "Mumbai",
  sports: ["cricket"],  // ← Array of strings, not objects
  skillLevel: "Beginner",  // ← Extracted from sports array
  availability: [],  // ← Required by PlayerCard
  bio: "...",
  avatar: "...",
  matchesPlayed: 0,
  eventsJoined: 0
}
```

### The Error
PlayerCard tried to access `player.availability.slice(0, 2)` but `availability` was undefined, causing the crash.

## Solution

### 1. Normalize Player Data in AppContext
Updated `loadBackendData()` to transform backend data to frontend format:

```javascript
const loadBackendData = async () => {
    try {
        const [playersData, eventsData] = await Promise.all([
            api.searchPlayers(),
            api.getEvents(),
        ]);
        
        // Normalize players data to match frontend format
        const normalizedPlayers = playersData.map(player => ({
            id: player.id,
            name: player.full_name || player.username,  // ← Map full_name to name
            email: player.email,
            username: player.username,
            city: player.city || '',
            sports: player.sports?.map(s => s.sport_name) || [],  // ← Extract sport names
            skillLevel: player.sports?.[0]?.skill_level || 'Beginner',  // ← Extract skill level
            availability: [],  // ← Provide default empty array
            bio: player.bio || '',
            avatar: player.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.username}`,
            matchesPlayed: 0,  // ← Provide default
            eventsJoined: 0,   // ← Provide default
        }));
        
        setPlayers(normalizedPlayers);
        setEvents(eventsData);
    } catch (error) {
        console.error('Failed to load backend data:', error);
    }
};
```

### 2. Make PlayerCard Defensive
Added null checks to handle missing fields gracefully:

```javascript
{/* Sports - check if exists and has items */}
{player.sports && player.sports.length > 0 ? (
    player.sports.map(sportId => (
        <span key={sportId} className="badge-sport text-xs">
            {getSportEmoji(sportId)} {getSportName(sportId)}
        </span>
    ))
) : (
    <span className="text-xs text-dark-500">No sports listed</span>
)}

{/* Bio - only show if exists */}
{player.bio && (
    <p className="text-sm text-dark-400 mt-3 line-clamp-2 leading-relaxed">
        {player.bio}
    </p>
)}

{/* Availability - only show if exists and has items */}
{player.availability && player.availability.length > 0 && (
    <div className="flex items-center gap-1.5 mt-3">
        <Clock size={12} className="text-dark-500" />
        <span className="text-xs text-dark-500 truncate">
            {player.availability.slice(0, 2).join(', ')}
            {player.availability.length > 2 && ` +${player.availability.length - 2}`}
        </span>
    </div>
)}
```

## Files Modified
1. `frontend/src/context/AppContext.jsx` - Added player data normalization in `loadBackendData()`
2. `frontend/src/components/PlayerCard.jsx` - Added defensive checks for optional fields

## How to Apply Fix

### Restart Frontend
```cmd
cd frontend
npm run dev
```

No backend restart needed - this is purely a frontend fix.

## Expected Behavior After Fix

### Before Fix:
- Login → Load players from backend
- Navigate to Discover page → CRASH (TypeError)
- Cannot view players

### After Fix:
- Login → Load players from backend → Normalize data
- Navigate to Discover page → Works!
- Players displayed correctly with:
  - Name (from full_name)
  - Sports (extracted from sports array)
  - Skill level (from first sport)
  - Bio (if available)
  - Availability hidden (empty array)
  - Default avatar if none set

## Data Transformation Examples

### Example 1: Player with Sports
**Backend:**
```json
{
  "id": 4,
  "username": "arjun",
  "full_name": "Arjun Kumar",
  "sports": [
    {"sport_name": "cricket", "skill_level": "Intermediate"},
    {"sport_name": "football", "skill_level": "Beginner"}
  ]
}
```

**Frontend (after normalization):**
```json
{
  "id": 4,
  "name": "Arjun Kumar",
  "username": "arjun",
  "sports": ["cricket", "football"],
  "skillLevel": "Intermediate",
  "availability": []
}
```

### Example 2: Player without Sports
**Backend:**
```json
{
  "id": 5,
  "username": "test",
  "full_name": null,
  "sports": []
}
```

**Frontend (after normalization):**
```json
{
  "id": 5,
  "name": "test",
  "username": "test",
  "sports": [],
  "skillLevel": "Beginner",
  "availability": []
}
```

## Why This Approach

### Option 1: Change Backend (Not Chosen)
- Add `availability`, `matchesPlayed`, `eventsJoined` to database
- More complex migration
- Takes longer to implement

### Option 2: Normalize in Frontend (Chosen) ✅
- Quick fix
- No database changes needed
- Maintains backward compatibility
- Can add backend fields later

## Future Improvements

To fully support all features, consider adding to backend:
1. **Availability** - Add `availability` JSON field to User model
2. **Stats** - Calculate `matchesPlayed` and `eventsJoined` from database
3. **Default Avatar** - Generate avatar URL in backend if not set

For now, the normalization layer handles the mismatch gracefully.

## Testing Checklist
- [x] Login works
- [x] Discover page loads without crash
- [ ] Player cards display correctly
- [ ] Player sports shown correctly
- [ ] Player bio shown (if available)
- [ ] Availability hidden (empty)
- [ ] Can click "View Profile"
- [ ] Can click "Message"
