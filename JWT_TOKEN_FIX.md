# JWT Token Fix - "Could not validate credentials"

## Issue
Users could login successfully (200 OK), but immediately after, all API calls returned 401 Unauthorized with "Could not validate credentials" error.

## Root Cause
The JWT "sub" (subject) claim was being set as an integer (user ID), but the JWT specification requires it to be a string. When the backend tried to decode the token, the `python-jose` library threw an error: "Subject must be a string."

### What Was Happening:
1. User logs in → Backend creates token with `{"sub": 4}` (integer)
2. Token is sent to frontend and stored
3. Frontend makes next API call with token in Authorization header
4. Backend tries to decode token → `python-jose` rejects it because sub is not a string
5. Backend returns 401 Unauthorized

## Solution
Modified the JWT token creation and validation in `backend/auth.py`:

### 1. Token Creation (`create_access_token`)
```python
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    
    # Convert sub to string if it's an integer (JWT spec requires string)
    if "sub" in to_encode and isinstance(to_encode["sub"], int):
        to_encode["sub"] = str(to_encode["sub"])
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
```

**Change**: Added conversion of `sub` from integer to string before encoding.

### 2. Token Validation (`get_current_user`)
```python
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id_str: str = payload.get("sub")
        if user_id_str is None:
            raise credentials_exception
        # Convert string back to int
        user_id = int(user_id_str)
        token_data = TokenData(user_id=user_id)
    except JWTError:
        raise credentials_exception
    except ValueError:
        raise credentials_exception
    
    user = db.query(User).filter(User.id == token_data.user_id).first()
    if user is None:
        raise credentials_exception
    return user
```

**Changes**: 
- Extract `sub` as string
- Convert string back to integer for database lookup
- Added `ValueError` exception handling for invalid conversions

## Files Modified
- `backend/auth.py` - Updated `create_access_token()` and `get_current_user()`

## Testing
Created `test_token_validation.py` to verify:
- Token generation with string sub
- Token decoding
- User ID extraction and validation

Test results:
```
✅ User found: arjun (ID: 4)
✅ Token decoded successfully
   Payload: {'sub': '4', 'exp': 1771483201}
✅ Token user ID matches database user ID
```

## How to Apply Fix

### IMPORTANT: Restart Backend Server
The backend must be restarted for changes to take effect:

```cmd
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Or use the batch file:
```cmd
start-backend.bat
```

### No Frontend Changes Needed
The frontend doesn't need any changes - it just stores and sends the token.

## Verification Steps

1. **Restart backend server**
2. **Login or register** a new account
3. **Check backend logs** - should see:
   ```
   POST /api/auth/login HTTP/1.1" 200 OK
   GET /api/users/me HTTP/1.1" 200 OK  ← Should be 200, not 401
   ```
4. **Check browser** - should redirect to Discover page without errors
5. **Profile and events** should load correctly

## Expected Behavior After Fix

✅ Login returns 200 OK with valid token
✅ Subsequent API calls use token successfully
✅ `/api/users/me` returns 200 OK with user data
✅ `/api/users/me/sports` returns 200 OK (can add sports)
✅ `/api/events/` returns 200 OK (can view events)
✅ All authenticated endpoints work correctly

## Why This Happened

The JWT specification (RFC 7519) states that the "sub" claim should be a string:
> "The 'sub' (subject) claim identifies the principal that is the subject of the JWT. The Claims in a JWT are normally statements about the subject. The subject value MUST either be scoped to be locally unique in the context of the issuer or be globally unique. The processing of this claim is generally application specific. The 'sub' value is a case-sensitive string containing a StringOrURI value."

The `python-jose` library enforces this requirement strictly, which is why it rejected tokens with integer subjects.

## Related Issues Fixed
This fix resolves:
- Login working but immediate 401 errors
- "Could not validate credentials" after successful login
- Unable to fetch user profile after authentication
- Unable to add sports during signup
- All authenticated API endpoints failing after login/signup
