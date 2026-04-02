import sys
sys.path.append('backend')

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import User
import os
from dotenv import load_dotenv

load_dotenv('backend/.env')

DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:IT@localhost:5432/flask_db')

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()

print("=" * 60)
print("Checking Users in Database")
print("=" * 60)

users = db.query(User).all()

if not users:
    print("\n❌ No users found in database!")
    print("\nYou need to register a new account first.")
else:
    print(f"\n✅ Found {len(users)} user(s):\n")
    for user in users:
        print(f"ID: {user.id}")
        print(f"Username: {user.username}")
        print(f"Email: {user.email}")
        print(f"Full Name: {user.full_name}")
        print(f"City: {user.city}")
        print(f"Created: {user.created_at}")
        print("-" * 60)

db.close()
