# PostgreSQL Database Setup

Your Sports Squad application is configured to use PostgreSQL.

## Current Configuration

```
Database: flask_db
Host: localhost
Port: 5432
Username: postgres
Password: IT
```

## Setup Steps

### 1. Verify PostgreSQL is Running

**Windows:**
```bash
# Check if PostgreSQL service is running
sc query postgresql-x64-14
# or
pg_ctl status
```

**Mac:**
```bash
brew services list | grep postgresql
```

**Linux:**
```bash
sudo systemctl status postgresql
```

### 2. Verify Database Exists

Connect to PostgreSQL:
```bash
psql -U postgres -h localhost
```

Check if database exists:
```sql
\l
```

If `flask_db` doesn't exist, create it:
```sql
CREATE DATABASE flask_db;
```

Exit psql:
```sql
\q
```

### 3. Test Connection

```bash
psql -U postgres -h localhost -d flask_db
```

If successful, you'll see:
```
flask_db=#
```

### 4. Start Backend

The backend will automatically create all tables on first run:

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
uvicorn main:app --reload
```

You should see:
```
INFO:     Application startup complete.
```

### 5. Verify Tables Created

Connect to database:
```bash
psql -U postgres -h localhost -d flask_db
```

List tables:
```sql
\dt
```

You should see:
```
 public | users              | table | postgres
 public | user_sports        | table | postgres
 public | events             | table | postgres
 public | event_participants | table | postgres
 public | messages           | table | postgres
```

## Troubleshooting

### Connection Refused

**Problem:** `could not connect to server: Connection refused`

**Solution:**
1. Start PostgreSQL service
2. Check if port 5432 is open
3. Verify PostgreSQL is listening on localhost

### Authentication Failed

**Problem:** `password authentication failed for user "postgres"`

**Solution:**
1. Verify password is correct: `IT`
2. Update `.env` file if password is different
3. Check `pg_hba.conf` for authentication method

### Database Does Not Exist

**Problem:** `database "flask_db" does not exist`

**Solution:**
```bash
psql -U postgres -h localhost
CREATE DATABASE flask_db;
\q
```

### Permission Denied

**Problem:** `permission denied for schema public`

**Solution:**
```sql
GRANT ALL PRIVILEGES ON DATABASE flask_db TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
```

## Database Management

### View All Data

```sql
-- Connect to database
psql -U postgres -h localhost -d flask_db

-- View users
SELECT * FROM users;

-- View events
SELECT * FROM events;

-- View messages
SELECT * FROM messages;
```

### Reset Database

**Warning:** This will delete all data!

```sql
-- Drop all tables
DROP TABLE IF EXISTS event_participants CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS user_sports CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```

Then restart the backend to recreate tables.

### Backup Database

```bash
pg_dump -U postgres -h localhost flask_db > backup.sql
```

### Restore Database

```bash
psql -U postgres -h localhost flask_db < backup.sql
```

## Environment Variables

Your `.env` file should contain:

```env
DATABASE_URL=postgresql://postgres:IT@localhost:5432/flask_db
SECRET_KEY=your-secret-key-change-in-production-use-openssl-rand-hex-32
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

## Connection String Format

```
postgresql://[user]:[password]@[host]:[port]/[database]
```

Your configuration:
- User: `postgres`
- Password: `IT`
- Host: `localhost`
- Port: `5432`
- Database: `flask_db`

## Verify Setup

1. PostgreSQL is running ✓
2. Database `flask_db` exists ✓
3. Can connect with credentials ✓
4. Backend starts without errors ✓
5. Tables are created ✓

## Next Steps

Once database is set up:

1. Start backend: `uvicorn main:app --reload`
2. Start frontend: `npm run dev`
3. Register a new user
4. Verify data is saved in PostgreSQL

## Useful Commands

```bash
# Connect to database
psql -U postgres -h localhost -d flask_db

# List databases
\l

# List tables
\dt

# Describe table
\d users

# View table data
SELECT * FROM users;

# Count records
SELECT COUNT(*) FROM users;

# Exit
\q
```

## Production Considerations

For production deployment:

1. **Use strong password** - Change from `IT` to a secure password
2. **Use environment variables** - Don't commit `.env` to git
3. **Enable SSL** - Use `sslmode=require` in connection string
4. **Connection pooling** - Configure in SQLAlchemy
5. **Regular backups** - Set up automated backups
6. **Monitoring** - Monitor database performance
7. **Separate user** - Create app-specific database user

Example production connection:
```
postgresql://app_user:strong_password@db.example.com:5432/sports_squad?sslmode=require
```

## Support

If you encounter issues:

1. Check PostgreSQL logs
2. Verify connection string in `.env`
3. Test connection with `psql`
4. Check backend logs for errors
5. Ensure all dependencies installed

## Success!

If you can:
- ✓ Connect to PostgreSQL
- ✓ See `flask_db` database
- ✓ Start backend without errors
- ✓ See tables created
- ✓ Register a user
- ✓ See user in database

Then your PostgreSQL setup is complete! 🎉
