import sys
sys.path.append('backend')

from auth import create_access_token, get_current_user
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import User
import os
from dotenv import load_dotenv
from jose import jwt

load_dotenv('backend/.env')

DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:IT@localhost:5432/flask_db')
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()

print("=" * 60)
print("Testing Token Generation and Validation")
print("=" * 60)

# Get a user from database
user = db.query(User).filter(User.email == "arjun@gmail.com").first()

if not user:
    print("❌ User not found")
    db.close()
    exit()

print(f"\n✅ User found: {user.username} (ID: {user.id})")

# Generate token
print("\nGenerating token...")
token = create_access_token(data={"sub": user.id})
print(f"Token generated: {token[:50]}...")

# Decode token
print("\nDecoding token...")
try:
    payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    print(f"✅ Token decoded successfully")
    print(f"   Payload: {payload}")
    print(f"   User ID in token: {payload.get('sub')}")
except Exception as e:
    print(f"❌ Failed to decode token: {e}")

# Verify token matches user
token_user_id = int(payload.get('sub'))
if token_user_id == user.id:
    print(f"\n✅ Token user ID matches database user ID")
else:
    print(f"\n❌ Token user ID mismatch!")
    print(f"   Token has: {token_user_id}")
    print(f"   Expected: {user.id}")

db.close()

print("\n" + "=" * 60)
print("Test Complete")
print("=" * 60)
