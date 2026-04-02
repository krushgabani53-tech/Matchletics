# Automatic Event Expiration

## Feature
Events with dates in the past are automatically filtered out when fetching events. Expired events are hidden from users but remain in the database until manually cleaned up.

## Implementation

### 1. Automatic Filtering (GET /api/events/)
When fetching events, the backend now:
- Parses each event's date
- Compares with today's date
- Excludes events where date < today
- Returns only upcoming/current events

**Code Location**: `backend/routers/events.py` - `get_events()` function

**How it works**:
```python
from datetime import datetime, date

today = date.today()

for event in events:
    event_date = datetime.strptime(event.date, '%Y-%m-%d').date()
    
    # Skip events that have already passed
    if event_date < today:
        continue
```

### 2. Manual Cleanup Endpoint
Added endpoint to permanently delete expired events from database.

**Endpoint**: `DELETE /api/events/cleanup-expired`

**Response**:
```json
{
  "message": "Cleanup completed",
  "deleted_events": 5
}
```

**Usage**:
```bash
curl -X DELETE http://localhost:8000/api/events/cleanup-expired
```

## Benefits

### User Experience
- ✅ Users only see upcoming events
- ✅ No clutter from past events
- ✅ Automatic - no manual intervention needed
- ✅ Works seamlessly in background

### Data Management
- Events remain in database for historical records
- Can be permanently deleted via cleanup endpoint
- Organizers can still access their past events if needed (future feature)

## Testing

### Test Automatic Filtering
1. Create an event with yesterday's date
2. Refresh events page
3. Event should not appear in the list

### Test Cleanup Endpoint
```bash
# Call cleanup endpoint
curl -X DELETE http://localhost:8000/api/events/cleanup-expired

# Response shows how many events were deleted
{
  "message": "Cleanup completed",
  "deleted_events": 3
}
```

## Date Format
Events must use ISO date format: `YYYY-MM-DD`
- Example: `2026-02-28`
- This is the standard HTML date input format
- Ensures consistent parsing across the application

## Error Handling
If an event has an invalid date format:
- Filtering: Event is included (fail-safe approach)
- Cleanup: Event is skipped (prevents accidental deletion)

This ensures the application continues working even with data inconsistencies.

## Future Enhancements

### Option 1: Scheduled Cleanup (Recommended)
Add a background task to run cleanup automatically:

```python
# In main.py
from apscheduler.schedulers.background import BackgroundScheduler

scheduler = BackgroundScheduler()

def cleanup_expired_events():
    # Call cleanup logic
    pass

# Run daily at 2 AM
scheduler.add_job(cleanup_expired_events, 'cron', hour=2)
scheduler.start()
```

### Option 2: Soft Delete
Instead of filtering, mark events as "expired":
- Add `is_expired` boolean field to Event model
- Update field when date passes
- Filter by `is_expired = False`

### Option 3: Archive System
- Move expired events to separate `archived_events` table
- Keep for historical/analytics purposes
- Organizers can view their past events

## How to Apply

### Restart Backend
The changes are in the backend, so restart it:
```cmd
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Verify
1. Create a test event with today's date
2. Create another with yesterday's date
3. Refresh events page
4. Only today's event should appear

## Manual Cleanup (Optional)
To permanently delete expired events from database:

```bash
# Using curl
curl -X DELETE http://localhost:8000/api/events/cleanup-expired

# Or visit in browser (will prompt for confirmation)
http://localhost:8000/api/events/cleanup-expired
```

## Notes
- Filtering happens on every GET request (no performance impact for small datasets)
- Events are compared by date only (time is ignored for expiration)
- Today's events are still shown (only past dates are filtered)
- Cleanup is optional - filtering works without it

## Example Scenarios

### Scenario 1: Event Today
- Event date: 2026-02-18
- Today: 2026-02-18
- **Result**: Event is shown ✅

### Scenario 2: Event Tomorrow
- Event date: 2026-02-19
- Today: 2026-02-18
- **Result**: Event is shown ✅

### Scenario 3: Event Yesterday
- Event date: 2026-02-17
- Today: 2026-02-18
- **Result**: Event is hidden ❌

### Scenario 4: Event Last Week
- Event date: 2026-02-11
- Today: 2026-02-18
- **Result**: Event is hidden ❌
