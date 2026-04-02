# 🎯 START HERE

Welcome to Sports Squad! This is your entry point to get started quickly.

## 🚀 What is Sports Squad?

A full-stack sports community platform where you can:
- 🔍 Discover players in your city
- 📅 Create and join sports events
- 💬 Message other players
- 👤 Manage your sports profile

## ⚡ Quick Start (5 Minutes)

**Prerequisites:** PostgreSQL must be running with database `flask_db` created.
See [DATABASE_SETUP.md](DATABASE_SETUP.md) if you need help with database setup.

### Option 1: Automated (Recommended)

**Windows:**
1. Double-click `start-backend.bat`
2. Double-click `start-frontend.bat`
3. Open http://localhost:5173

**Mac/Linux:**
```bash
chmod +x start-backend.sh start-frontend.sh
./start-backend.sh &
./start-frontend.sh
```

### Option 2: Manual

**Terminal 1 (Backend):**
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
uvicorn main:app --reload
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install
npm run dev
```

## 🎮 Try It Out

1. Open http://localhost:5173
2. Click "Get Started"
3. Register or use demo account:
   - Email: `arjun@playmate.app`
   - Password: `demo123`

## 📚 Documentation

| Document | Purpose | When to Read |
|----------|---------|--------------|
| **[QUICKSTART.md](QUICKSTART.md)** | 5-min setup guide | First time setup |
| **[README.md](README.md)** | Complete documentation | Full understanding |
| **[API_REFERENCE.md](API_REFERENCE.md)** | API endpoints | API development |
| **[ARCHITECTURE.md](ARCHITECTURE.md)** | System design | Understanding structure |
| **[TESTING.md](TESTING.md)** | Testing guide | QA and testing |
| **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** | Doc navigation | Finding specific info |

## ✅ What's Working

- ✅ User authentication (register/login)
- ✅ Player discovery (search by city, sport, skill)
- ✅ Events management (create, join, leave) ✨ NEW
- ✅ Messaging system
- ✅ Profile management
- ✅ Settings (password, email, notifications)
- ✅ Dashboard statistics

## 🔧 Tech Stack

**Backend:** FastAPI + SQLAlchemy + PostgreSQL
**Frontend:** React + Vite + TailwindCSS

## 🆘 Having Issues?

1. **Database issues?** Check [DATABASE_SETUP.md](DATABASE_SETUP.md)
2. Check [QUICKSTART.md](QUICKSTART.md) troubleshooting section
3. Verify Python 3.8+ and Node.js 16+ installed
4. Ensure PostgreSQL is running
5. Check terminal logs for errors
6. Review [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)

## 🎯 Next Steps

After getting it running:

1. **Explore the UI** - Try all features
2. **Check API Docs** - http://localhost:8000/docs
3. **Read Architecture** - Understand the system
4. **Run Tests** - Follow TESTING.md
5. **Customize** - Make it your own!

## 📊 Project Status

✅ Backend API: Complete (35+ endpoints)
✅ Frontend: Complete (9 pages, 9 components)
✅ Integration: Complete (API + Frontend)
✅ Documentation: Complete (9 files, 100+ pages)
✅ Testing: Manual testing guide provided

## 🎉 You're Ready!

The system is fully functional and ready to use. Choose your path:

- **Just want to use it?** → Follow Quick Start above
- **Want to understand it?** → Read [README.md](README.md)
- **Want to develop?** → Read [ARCHITECTURE.md](ARCHITECTURE.md)
- **Want to test?** → Read [TESTING.md](TESTING.md)

## 💡 Pro Tips

1. Ensure PostgreSQL is running before starting backend
2. Use Swagger UI (http://localhost:8000/docs) to test APIs
3. Check browser console (F12) for frontend errors
4. Backend logs show in terminal 1
5. Frontend logs show in terminal 2
6. Database: `flask_db` on PostgreSQL

## 🌟 Key Features

### For Players
- Search players by location and sport
- View detailed profiles
- Send direct messages
- Join events in your city

### For Organizers
- Create sports events
- Manage participants
- Set event details (date, time, location)
- Track event capacity

### For Everyone
- Secure authentication
- Profile customization
- Privacy settings
- Notification preferences

## 📱 Responsive Design

Works on:
- 💻 Desktop
- 📱 Mobile
- 📲 Tablet

## 🔐 Security

- Password hashing (bcrypt)
- JWT authentication
- Protected routes
- Input validation

## 🚀 Ready to Go!

Everything is set up and ready. Just run the start scripts and you're good to go!

**Questions?** Check [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) for the right guide.

**Happy coding!** 🎊
