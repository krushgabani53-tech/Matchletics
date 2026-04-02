# Complete Restart Instructions

## Changes Made
Fixed login to accept email OR username. Both backend and frontend have been updated.

## Step-by-Step Restart Process

### 1. Stop Running Servers (if any)
- Press `Ctrl+C` in both backend and frontend terminals
- Or close the terminal windows

### 2. Restart Backend
Open a new terminal and run:
```cmd
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Or use the batch file:
```cmd
start-backend.bat
```

**Wait for this message:**
```
INFO:     Application startup complete.
```

### 3. Restart Frontend
Open another terminal and run:
```cmd
cd frontend
npm run dev
```

Or use the batch file:
```cmd
start-frontend.bat
```

**Wait for this message:**
```
VITE ready in XXX ms
Local: http://localhost:5173/
```

### 4. Test Login

1. Open browser to http://localhost:5173
2. Click "Log In"
3. Enter credentials:
   - **Email**: arjun@gmail.com (or any email from the database)
   - **Password**: (the password you used during registration)
4. Click "Log In"

### 5. If Login Fails

#### Check Backend Terminal
Look for error messages like:
- `401 Unauthorized` - Wrong password or email
- `500 Internal Server Error` - Code error
- Connection errors - Database not running

#### Check Browser Console (F12)
Look for:
- Network errors (red in Network tab)
- JavaScript errors (red in Console tab)
- API response details

#### Verify Database
Run this to check users:
```cmd
python check_users_detailed.py
```

#### Test Authentication
Run this to test password:
```cmd
python test_login.py
```
Enter the email and password when prompted.

### 6. Create New Account (Alternative)

If you don't remember the password:
1. Go to Sign Up page
2. Create a new account with:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
   - City: Mumbai
   - Select some sports
3. After signup, you'll be logged in automatically
4. Try logging out and logging back in

## Common Issues

### Issue: "Could not validate credentials"
**Cause**: Wrong email/username or password
**Solution**: 
- Verify email exists in database: `python check_users_detailed.py`
- Try registering a new account
- Make sure backend is restarted with new code

### Issue: Backend not starting
**Cause**: Port 8000 already in use
**Solution**:
```cmd
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

### Issue: Frontend not connecting to backend
**Cause**: Backend not running or wrong URL
**Solution**:
- Verify backend is running on http://localhost:8000
- Check `frontend/.env` has correct `VITE_API_URL`
- Check browser console for CORS errors

## Quick Test Commands

```cmd
# Test database connection
python backend/test_db_connection.py

# Check users in database
python check_users_detailed.py

# Test query functionality
python test_query.py

# Test authentication (interactive)
python test_login.py
```

## Success Indicators

✅ Backend shows: `INFO: Application startup complete`
✅ Frontend shows: `Local: http://localhost:5173/`
✅ Database test shows: `✅ Database is ready!`
✅ Login redirects to Discover page
✅ No errors in browser console
