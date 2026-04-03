from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, text
from database import engine, Base
from routers import auth, users, messages, dashboard, settings, events


def ensure_user_location_columns():
    inspector = inspect(engine)
    existing_columns = {column["name"] for column in inspector.get_columns("users")}

    with engine.begin() as connection:
        if "latitude" not in existing_columns:
            connection.execute(text("ALTER TABLE users ADD COLUMN latitude FLOAT"))
        if "longitude" not in existing_columns:
            connection.execute(text("ALTER TABLE users ADD COLUMN longitude FLOAT"))

# Create database tables
Base.metadata.create_all(bind=engine)
ensure_user_location_columns()

app = FastAPI(
    title="Sports Squad API",
    description="API for connecting local sports enthusiasts",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(messages.router, prefix="/api/messages", tags=["Messages"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(settings.router, prefix="/api/settings", tags=["Settings"])
app.include_router(events.router, prefix="/api/events", tags=["Events"])

@app.get("/")
def root():
    return {"message": "Sports Squad API is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
