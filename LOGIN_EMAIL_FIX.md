# Login with Email Fix

## Issue
Users couldn't log in using their email address. The login page showed "Could not validate credentials" error.

## Root Cause
- Frontend login page accepts email input
- Backend `authenticate_user()` function only searched by username
- AppContext tried to extract username from email by splitting at '@', which didn't match the actual username stored in database
- Example: User registers with username "arjun123" but tries to login with "arjun@gmail.com" - the extracted username "arjun" doesn't match

## Solution
Modified backend to accept either email OR username for login:

### Backend Changes:

1. **backend/auth.py** - Updated `authenticate_user()` function:
   ```python
   def authenticate_user(db: Session, username_or_email: str, password: str) -> Optional[User]:
       # Try to find user by username first, then by email
       user = db.query(User).filter(
           (User.username == username_or_email) | (User.email == username_or_email)
       ).first()
       if not user:
           return None
       if not verify_password(password, user.password_hash):
           return None
       return user
   ```
   - Now uses SQLAlchemy OR filter to search by username OR email
   - Renamed parameter to `username_or_email` for clarity

2. **backend/schemas.py** - Updated `UserLogin` schema comment:
   ```python
   class UserLogin(BaseModel):
       username: str  # Can be username or email
       password: str
   ```
   - Added comment to clarify that username field accepts both

3. **backend/routers/auth.py** - Updated login endpoint comment:
   ```python
   # credentials.username can be either username or email
   user = authenticate_user(db, credentials.username, credentials.password)
   ```

### Frontend Changes:

1. **frontend/src/context/AppContext.jsx** - Updated `login()` function:
   ```javascript
   const login = async (email, password) => {
       try {
           // Try backend first - send email directly (backend accepts email or username)
           const response = await api.login(email, password);
           // ... rest of the code
       }
   }
   ```
   - Removed the line: `const username = email.split('@')[0];`
   - Now sends email directly to backend
   - Backend handles the lookup by email or username

## How It Works Now

1. User enters email (e.g., "arjun@gmail.com") in login form
2. Frontend sends email directly to backend
3. Backend searches database for user with matching email OR username
4. If found and password matches, authentication succeeds
5. User can also login with username if they prefer

## Benefits

- Users can login with email (more intuitive)
- Users can also login with username (more flexible)
- No need to remember which username was auto-generated during signup
- Backend handles both cases transparently

## Testing

Test these scenarios:
- ✅ Login with email: "arjun@gmail.com"
- ✅ Login with username: "arjun" (if that's the actual username)
- ✅ Wrong password shows "Invalid credentials"
- ✅ Non-existent email shows "Invalid credentials"
