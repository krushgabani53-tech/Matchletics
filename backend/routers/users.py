from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from math import radians, sin, cos, sqrt, atan2
from database import get_db
from models import User, UserSport
from schemas import UserResponse, UserUpdate, PlayerResponse, UserSportResponse, UserSportCreate
from auth import get_current_user

router = APIRouter()


def calculate_distance_km(latitude_one: float, longitude_one: float, latitude_two: float, longitude_two: float) -> float:
    earth_radius_km = 6371.0
    latitude_one_rad = radians(latitude_one)
    longitude_one_rad = radians(longitude_one)
    latitude_two_rad = radians(latitude_two)
    longitude_two_rad = radians(longitude_two)

    delta_latitude = latitude_two_rad - latitude_one_rad
    delta_longitude = longitude_two_rad - longitude_one_rad

    a = sin(delta_latitude / 2) ** 2 + cos(latitude_one_rad) * cos(latitude_two_rad) * sin(delta_longitude / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return earth_radius_km * c


def serialize_user(user: User, distance_km: Optional[float] = None):
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "full_name": user.full_name,
        "city": user.city,
        "latitude": user.latitude,
        "longitude": user.longitude,
        "bio": user.bio,
        "avatar": user.avatar,
        "created_at": user.created_at,
        "email_notifications": user.email_notifications,
        "push_notifications": user.push_notifications,
        "match_suggestions": user.match_suggestions,
        "profile_visible": user.profile_visible,
        "show_online_status": user.show_online_status,
        "distance_km": distance_km,
        "sports": [
            {
                "id": sport.id,
                "user_id": sport.user_id,
                "sport_name": sport.sport_name,
                "skill_level": sport.skill_level,
            }
            for sport in user.sports
        ],
    }

@router.get("/me", response_model=PlayerResponse)
def get_current_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return serialize_user(current_user)

@router.put("/me", response_model=PlayerResponse)
def update_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if user_update.full_name is not None:
        current_user.full_name = user_update.full_name
    if user_update.bio is not None:
        current_user.bio = user_update.bio
    if user_update.city is not None:
        current_user.city = user_update.city
    if user_update.latitude is not None:
        current_user.latitude = user_update.latitude
    if user_update.longitude is not None:
        current_user.longitude = user_update.longitude
    if user_update.avatar is not None:
        current_user.avatar = user_update.avatar
    
    db.commit()
    db.refresh(current_user)
    
    return serialize_user(current_user)

@router.get("/{user_id}", response_model=PlayerResponse)
def get_user_by_id(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return serialize_user(user)

@router.get("/", response_model=List[PlayerResponse])
def search_players(
    city: str = None,
    sport: str = None,
    latitude: Optional[float] = Query(None),
    longitude: Optional[float] = Query(None),
    radius_km: Optional[float] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(User).filter(User.id != current_user.id)
    
    if city:
        query = query.filter(User.city == city)
    
    if sport:
        query = query.join(UserSport).filter(UserSport.sport_name == sport)
    
    players = query.all()
    results = []

    for player in players:
        distance_km = None

        if latitude is not None and longitude is not None and player.latitude is not None and player.longitude is not None:
            distance_km = calculate_distance_km(latitude, longitude, player.latitude, player.longitude)
            if radius_km is not None and distance_km > radius_km:
                continue

        results.append((distance_km, serialize_user(player, distance_km)))

    if latitude is not None and longitude is not None:
        results.sort(key=lambda item: item[0] if item[0] is not None else float("inf"))
    else:
        results.sort(key=lambda item: (item[1]["city"] or "", item[1]["username"] or ""))

    return [item[1] for item in results]

@router.post("/me/sports", response_model=UserSportResponse, status_code=status.HTTP_201_CREATED)
def add_user_sport(
    sport_data: UserSportCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_sport = UserSport(
        user_id=current_user.id,
        sport_name=sport_data.sport_name,
        skill_level=sport_data.skill_level
    )
    
    db.add(new_sport)
    db.commit()
    db.refresh(new_sport)
    return new_sport

@router.get("/me/sports", response_model=List[UserSportResponse])
def get_user_sports(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    sports = db.query(UserSport).filter(UserSport.user_id == current_user.id).all()
    return sports

@router.delete("/me/sports/{sport_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_sport(
    sport_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    sport = db.query(UserSport).filter(
        UserSport.id == sport_id,
        UserSport.user_id == current_user.id
    ).first()
    
    if not sport:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sport not found"
        )
    
    db.delete(sport)
    db.commit()
    return None
