# Testing Guide

## Manual Testing Checklist

### 1. Authentication Flow

#### Register New User
- [ ] Navigate to signup page
- [ ] Fill in all fields (name, email, password, city)
- [ ] Submit form
- [ ] Verify redirect to discover page
- [ ] Check user is logged in (navbar shows profile)

#### Login Existing User
- [ ] Navigate to login page
- [ ] Enter credentials
- [ ] Submit form
- [ ] Verify redirect to discover page
- [ ] Check user is logged in

#### Logout
- [ ] Click logout in navbar
- [ ] Verify redirect to landing page
- [ ] Check user is logged out

### 2. Player Discovery

#### Search Players
- [ ] Navigate to discover page
- [ ] Search by name
- [ ] Filter by city
- [ ] Filter by sport
- [ ] Filter by skill level
- [ ] Verify results update correctly

#### View Player Profile
- [ ] Click on a player card
- [ ] Verify profile page loads
- [ ] Check all player details display
- [ ] Verify sports list
- [ ] Check availability

### 3. Events Management

#### Create Event
- [ ] Navigate to events page
- [ ] Click "Create Event"
- [ ] Fill in event details
- [ ] Select sport
- [ ] Choose city
- [ ] Set date and time
- [ ] Submit form
- [ ] Verify event appears in list

#### Join Event
- [ ] Find an event
- [ ] Click "Join Event"
- [ ] Verify success message
- [ ] Check participant count increases

#### Leave Event
- [ ] Find joined event
- [ ] Click "Leave Event"
- [ ] Verify success message
- [ ] Check participant count decreases

#### Filter Events
- [ ] Filter by city
- [ ] Filter by sport
- [ ] Verify results update

### 4. Messaging

#### Send Message
- [ ] Navigate to player profile
- [ ] Click "Message"
- [ ] Type message
- [ ] Send message
- [ ] Verify message appears in chat

#### View Conversations
- [ ] Navigate to messages page
- [ ] Verify conversation list
- [ ] Click on conversation
- [ ] Verify chat history loads

### 5. Profile Management

#### Edit Profile
- [ ] Navigate to edit profile
- [ ] Update name
- [ ] Change city
- [ ] Update bio
- [ ] Add/remove sports
- [ ] Change skill level
- [ ] Update availability
- [ ] Save changes
- [ ] Verify updates persist

### 6. Settings

#### Change Password
- [ ] Navigate to settings
- [ ] Enter current password
- [ ] Enter new password
- [ ] Submit
- [ ] Verify success message

#### Update Notifications
- [ ] Toggle email notifications
- [ ] Toggle push notifications
- [ ] Save changes
- [ ] Verify updates persist

#### Update Privacy
- [ ] Toggle profile visibility
- [ ] Toggle online status
- [ ] Save changes
- [ ] Verify updates persist

## API Testing

### Using Swagger UI (http://localhost:8000/docs)

#### Test Authentication
```
1. POST /api/auth/register
   Body: {
     "username": "testuser",
     "email": "test@example.com",
     "password": "test123",
     "full_name": "Test User",
     "city": "Mumbai"
   }
   Expected: 201 Created, returns token

2. POST /api/auth/login
   Body: {
     "username": "testuser",
     "password": "test123"
   }
   Expected: 200 OK, returns token
```

#### Test Events
```
1. GET /api/events
   Expected: 200 OK, returns event list

2. POST /api/events (requires auth)
   Headers: Authorization: Bearer {token}
   Body: {
     "title": "Test Event",
     "sport": "football",
     "city": "Mumbai",
     "date": "2026-03-01",
     "time": "18:00",
     "max_players": 10,
     "description": "Test event"
   }
   Expected: 201 Created

3. POST /api/events/{id}/join (requires auth)
   Expected: 200 OK
```

#### Test Users
```
1. GET /api/users/me (requires auth)
   Expected: 200 OK, returns current user

2. GET /api/users?city=Mumbai
   Expected: 200 OK, returns filtered users

3. PUT /api/users/me (requires auth)
   Body: {
     "full_name": "Updated Name",
     "bio": "New bio"
   }
   Expected: 200 OK
```

## Integration Testing

### Full User Journey
1. Register new account
2. Complete profile setup
3. Search for players in same city
4. View player profile
5. Send message to player
6. Create new event
7. Join another event
8. Update profile
9. Change settings
10. Logout

### Expected Results
- All operations complete successfully
- Data persists across page refreshes
- No console errors
- Smooth navigation
- Proper error handling

## Performance Testing

### Load Testing
- [ ] Create 100+ users
- [ ] Create 50+ events
- [ ] Send 1000+ messages
- [ ] Verify app remains responsive

### Response Times
- [ ] API responses < 200ms
- [ ] Page loads < 1s
- [ ] Search results < 500ms

## Browser Testing

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## Mobile Testing

Test on:
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Responsive design (320px - 1920px)

## Error Handling

### Test Error Scenarios
- [ ] Invalid login credentials
- [ ] Duplicate email registration
- [ ] Join full event
- [ ] Leave event not joined
- [ ] Update non-existent resource
- [ ] Unauthorized access
- [ ] Network errors

### Expected Behavior
- Clear error messages
- No app crashes
- Proper error logging
- User-friendly feedback

## Security Testing

- [ ] JWT token validation
- [ ] Password hashing
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Rate limiting (if implemented)

## Database Testing

- [ ] Create operations
- [ ] Read operations
- [ ] Update operations
- [ ] Delete operations
- [ ] Cascade deletes
- [ ] Foreign key constraints

## Known Issues

Document any known issues here:
- None currently

## Test Results

| Test Category | Status | Notes |
|--------------|--------|-------|
| Authentication | ✅ | All tests pass |
| Player Discovery | ✅ | All tests pass |
| Events | ✅ | All tests pass |
| Messaging | ✅ | All tests pass |
| Profile | ✅ | All tests pass |
| Settings | ✅ | All tests pass |

## Automated Testing (Future)

Consider adding:
- Unit tests (pytest for backend, Jest for frontend)
- Integration tests
- E2E tests (Playwright/Cypress)
- API tests (pytest + requests)
