"""
Test PostgreSQL database connection
Run this to verify your database is configured correctly
"""
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

print("=" * 60)
print("Testing PostgreSQL Connection")
print("=" * 60)
print(f"\nDatabase URL: {DATABASE_URL}")
print("\nAttempting to connect...")

try:
    # Create engine
    engine = create_engine(DATABASE_URL)
    
    # Test connection
    with engine.connect() as connection:
        result = connection.execute(text("SELECT version();"))
        version = result.fetchone()[0]
        print("\n✅ Connection successful!")
        print(f"\nPostgreSQL version:\n{version}")
        
        # Check if database exists
        result = connection.execute(text("SELECT current_database();"))
        db_name = result.fetchone()[0]
        print(f"\n✅ Connected to database: {db_name}")
        
        # List tables
        result = connection.execute(text("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name;
        """))
        tables = result.fetchall()
        
        if tables:
            print(f"\n✅ Found {len(tables)} tables:")
            for table in tables:
                print(f"   - {table[0]}")
        else:
            print("\n⚠️  No tables found (will be created on first run)")
        
        print("\n" + "=" * 60)
        print("✅ Database is ready!")
        print("=" * 60)
        print("\nYou can now start the backend with:")
        print("  uvicorn main:app --reload")
        
except Exception as e:
    print("\n❌ Connection failed!")
    print(f"\nError: {str(e)}")
    print("\n" + "=" * 60)
    print("Troubleshooting:")
    print("=" * 60)
    print("1. Ensure PostgreSQL is running")
    print("2. Verify database 'flask_db' exists:")
    print("   psql -U postgres -h localhost")
    print("   CREATE DATABASE flask_db;")
    print("3. Check credentials in .env file")
    print("4. Verify connection string format:")
    print("   postgresql://user:password@host:port/database")
    print("\nSee DATABASE_SETUP.md for detailed help")
