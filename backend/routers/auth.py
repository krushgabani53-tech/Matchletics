from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import User, UserLocation
from schemas import UserCreate, UserLogin, UserResponse, Token
from auth import get_password_hash, authenticate_user, create_access_token
from datetime import datetime

# City to default coordinates mapping
CITY_COORDINATES = {
    'Mumbai': (19.0760, 72.8777),
    'Delhi': (28.6139, 77.2090),
    'Bangalore': (12.9716, 77.5946),
    'Hyderabad': (17.3850, 78.4867),
    'Chennai': (13.0827, 80.2707),
    'Kolkata': (22.5726, 88.3639),
    'Pune': (18.5204, 73.8567),
    'Ahmedabad': (23.0225, 72.5714),
    'Jaipur': (26.9124, 75.7873),
    'Kochi': (9.9312, 76.2673),
    'Chandigarh': (30.7333, 76.7794),
}

router = APIRouter()

@router.post("/register", response_model=dict, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if username exists
    if db.query(User).filter(User.username == user_data.username).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists"
        )
    
    # Check if email exists
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already exists"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        password_hash=hashed_password,
        full_name=user_data.full_name,
        city=user_data.city
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create default location record based on city
    coords = CITY_COORDINATES.get(user_data.city, (20.5937, 78.9629))  # India center as fallback
    user_location = UserLocation(
        user_id=new_user.id,
        latitude=coords[0],
        longitude=coords[1],
        sharing_enabled=True,
        last_updated=datetime.utcnow()
    )
    db.add(user_location)
    db.commit()
    
    # Create access token
    access_token = create_access_token(data={"sub": new_user.id})
    
    return {
        "message": "User registered successfully",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "username": new_user.username,
            "email": new_user.email,
            "full_name": new_user.full_name,
            "city": new_user.city
        }
    }

@router.post("/login", response_model=dict)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = authenticate_user(db, credentials.username, credentials.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Ensure user has a location record
    user_location = db.query(UserLocation).filter(UserLocation.user_id == user.id).first()
    if not user_location:
        coords = CITY_COORDINATES.get(user.city, (20.5937, 78.9629))
        user_location = UserLocation(
            user_id=user.id,
            latitude=coords[0],
            longitude=coords[1],
            sharing_enabled=True,
            last_updated=datetime.utcnow()
        )
        db.add(user_location)
        db.commit()
    
    access_token = create_access_token(data={"sub": user.id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name,
            "city": user.city
        }
    }
