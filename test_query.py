import sys
sys.path.append('backend')

from sqlalchemy import create_engine, or_
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
print("Testing Database Query with OR condition")
print("=" * 60)

test_input = "arjun@gmail.com"

print(f"\nSearching for user with username OR email = '{test_input}'")

# Test the query
user = db.query(User).filter(
    (User.username == test_input) | (User.email == test_input)
).first()

if user:
    print(f"\n✅ User found!")
    print(f"   ID: {user.id}")
    print(f"   Username: {user.username}")
    print(f"   Email: {user.email}")
    print(f"   Full Name: {user.full_name}")
else:
    print(f"\n❌ No user found with username or email = '{test_input}'")

# Also test with username
print("\n" + "=" * 60)
test_input2 = "arjun"
print(f"Searching for user with username OR email = '{test_input2}'")

user2 = db.query(User).filter(
    (User.username == test_input2) | (User.email == test_input2)
).first()

if user2:
    print(f"\n✅ User found!")
    print(f"   ID: {user2.id}")
    print(f"   Username: {user2.username}")
    print(f"   Email: {user2.email}")
    print(f"   Full Name: {user2.full_name}")
else:
    print(f"\n❌ No user found with username or email = '{test_input2}'")

db.close()
