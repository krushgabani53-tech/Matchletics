import sys
sys.path.append('backend')

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import User
from auth import verify_password, authenticate_user
import os
from dotenv import load_dotenv

load_dotenv('backend/.env')

DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:IT@localhost:5432/flask_db')

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()

print("=" * 60)
print("Testing Login Authentication")
print("=" * 60)

# Test with arjun@gmail.com
test_email = "arjun@gmail.com"
test_password = input(f"\nEnter password for {test_email}: ")

print(f"\nAttempting to authenticate with email: {test_email}")

# Try to find user by email
user = db.query(User).filter(User.email == test_email).first()

if user:
    print(f"✅ User found in database:")
    print(f"   Username: {user.username}")
    print(f"   Email: {user.email}")
    print(f"   Full Name: {user.full_name}")
    
    # Test password
    print(f"\nTesting password...")
    if verify_password(test_password, user.password_hash):
        print("✅ Password is CORRECT!")
    else:
        print("❌ Password is INCORRECT!")
        print("\nThe password you entered doesn't match the stored hash.")
        print("You may need to register a new account or reset the password.")
else:
    print(f"❌ No user found with email: {test_email}")

print("\n" + "=" * 60)
print("Testing authenticate_user function")
print("=" * 60)

# Test the authenticate_user function
authenticated = authenticate_user(db, test_email, test_password)
if authenticated:
    print(f"✅ authenticate_user() returned user: {authenticated.username}")
else:
    print("❌ authenticate_user() returned None (authentication failed)")

db.close()
