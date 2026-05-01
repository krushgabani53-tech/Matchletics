<<<<<<< HEAD
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from math import radians, sin, cos, sqrt, atan2
from database import get_db
from models import User, UserSport
from schemas import UserResponse, UserUpdate, PlayerResponse, UserSportResponse, UserSportCreate
=======
from datetime import datetime, timedelta
from math import acos, cos, radians, sin
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

>>>>>>> 02de44d (Add map page, deployment config, and fixes)
from auth import get_current_user
from database import get_db
from models import User, UserLocation, UserSport
from schemas import LocationUpdate, PlayerResponse, UserSportCreate, UserSportResponse, UserUpdate

router = APIRouter()

<<<<<<< HEAD

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
=======
EARTH_RADIUS_KM = 6371.0
ACTIVE_LOCATION_MINUTES = 60  # Extended to 60 mins so inactive players still show


def get_location_settings(user_id: int, db: Session):
    return db.query(UserLocation).filter(UserLocation.user_id == user_id).first()


def get_primary_sport(user: User) -> Optional[str]:
    if not user.sports:
        return None
    return user.sports[0].sport_name


def build_player_dict(
    user: User,
    db: Session,
    distance_km: Optional[float] = None,
    include_coordinates: bool = False,
):
    location = get_location_settings(user.id, db)
    include_coordinates = location is not None and location.sharing_enabled and include_coordinates
>>>>>>> 02de44d (Add map page, deployment config, and fixes)
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "full_name": user.full_name,
        "city": user.city,
<<<<<<< HEAD
        "latitude": user.latitude,
        "longitude": user.longitude,
=======
>>>>>>> 02de44d (Add map page, deployment config, and fixes)
        "bio": user.bio,
        "avatar": user.avatar,
        "created_at": user.created_at,
        "email_notifications": user.email_notifications,
        "push_notifications": user.push_notifications,
        "match_suggestions": user.match_suggestions,
        "profile_visible": user.profile_visible,
        "show_online_status": user.show_online_status,
<<<<<<< HEAD
        "distance_km": distance_km,
        "sports": [
            {
                "id": sport.id,
                "user_id": sport.user_id,
                "sport_name": sport.sport_name,
                "skill_level": sport.skill_level,
            }
=======
        "location_sharing_enabled": True if location is None else location.sharing_enabled,
        "primary_sport": get_primary_sport(user),
        "distance_km": distance_km,
        "latitude": round(location.latitude, 6) if include_coordinates else None,
        "longitude": round(location.longitude, 6) if include_coordinates else None,
        "sports": [
            {"id": sport.id, "user_id": sport.user_id, "sport_name": sport.sport_name, "skill_level": sport.skill_level}
>>>>>>> 02de44d (Add map page, deployment config, and fixes)
            for sport in user.sports
        ],
    }

<<<<<<< HEAD
=======

def haversine_km(latitude_1: float, longitude_1: float, latitude_2: float, longitude_2: float) -> float:
    cosine_value = (
        cos(radians(latitude_1)) * cos(radians(latitude_2)) * cos(radians(longitude_2 - longitude_1))
        + sin(radians(latitude_1)) * sin(radians(latitude_2))
    )
    return EARTH_RADIUS_KM * acos(max(-1.0, min(1.0, cosine_value)))


def get_location_bounds(latitude: float, radius_km: float):
    lat_delta = radius_km / 111.0
    lon_scale = max(cos(radians(latitude)), 0.01)
    lon_delta = radius_km / (111.0 * lon_scale)
    return lat_delta, lon_delta


>>>>>>> 02de44d (Add map page, deployment config, and fixes)
@router.get("/me", response_model=PlayerResponse)
def get_current_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
<<<<<<< HEAD
    return serialize_user(current_user)
=======
    return build_player_dict(current_user, db)

>>>>>>> 02de44d (Add map page, deployment config, and fixes)

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
<<<<<<< HEAD
    
    return serialize_user(current_user)
=======

    return build_player_dict(current_user, db)


@router.put("/me/location", response_model=dict)
def update_location(
    location_data: LocationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    location = get_location_settings(current_user.id, db)
    sharing_enabled = location_data.sharing_enabled if location_data.sharing_enabled is not None else True

    if not location:
        location = UserLocation(
            user_id=current_user.id,
            latitude=location_data.latitude,
            longitude=location_data.longitude,
            sharing_enabled=sharing_enabled,
            last_updated=datetime.utcnow(),
        )
        db.add(location)
    else:
        location.latitude = location_data.latitude
        location.longitude = location_data.longitude
        location.sharing_enabled = sharing_enabled
        location.last_updated = datetime.utcnow()

    db.commit()
    db.refresh(location)

    return {
        "message": "Location updated successfully",
        "sharing_enabled": location.sharing_enabled,
        "last_updated": location.last_updated,
    }


@router.get("/nearby", response_model=List[PlayerResponse])
def get_nearby_players(
    latitude: float = Query(...),
    longitude: float = Query(...),
    radius: float = Query(100.0, ge=1.0, le=500.0),
    sport: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    lat_delta, lon_delta = get_location_bounds(latitude, radius)
    active_cutoff = datetime.utcnow() - timedelta(minutes=ACTIVE_LOCATION_MINUTES)

    query = (
        db.query(User, UserLocation)
        .join(UserLocation, UserLocation.user_id == User.id)
        .filter(
            User.id != current_user.id,
            User.profile_visible == True,
            UserLocation.sharing_enabled == True,
            UserLocation.last_updated >= active_cutoff,
            UserLocation.latitude.between(latitude - lat_delta, latitude + lat_delta),
            UserLocation.longitude.between(longitude - lon_delta, longitude + lon_delta),
        )
    )

    if sport:
        sport_values = [item.strip() for item in sport.split(",") if item.strip()]
        if sport_values:
            query = query.join(UserSport).filter(UserSport.sport_name.in_(sport_values))

    candidates = query.distinct().all()
    nearby_players = []

    for user, user_location in candidates:
        distance_km = haversine_km(latitude, longitude, user_location.latitude, user_location.longitude)
        if distance_km <= radius:
            nearby_players.append(
                build_player_dict(user, db, distance_km=round(distance_km, 1), include_coordinates=True)
            )

    nearby_players.sort(key=lambda player: player.get("distance_km", 999999))
    return nearby_players[:20]


@router.get("/map-players", response_model=List[PlayerResponse])
def get_map_players(
    latitude: Optional[float] = Query(None),
    longitude: Optional[float] = Query(None),
    sport: Optional[str] = Query(None),
    limit: int = Query(200, ge=1, le=500),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    active_cutoff = datetime.utcnow() - timedelta(minutes=ACTIVE_LOCATION_MINUTES)

    # Get all users with location sharing enabled (including current user)
    query = (
        db.query(User, UserLocation)
        .join(UserLocation, UserLocation.user_id == User.id)
        .filter(
            User.profile_visible == True,
            UserLocation.sharing_enabled == True,
            UserLocation.last_updated >= active_cutoff,
        )
    )

    if sport:
        sport_values = [item.strip() for item in sport.split(",") if item.strip()]
        if sport_values:
            query = query.join(UserSport).filter(UserSport.sport_name.in_(sport_values))

    query = query.order_by(UserLocation.last_updated.desc()).limit(limit)
    candidates = query.distinct().all()

    map_players = []
    for user, user_location in candidates:
        distance_km = None
        if latitude is not None and longitude is not None:
            distance_km = round(haversine_km(latitude, longitude, user_location.latitude, user_location.longitude), 1)

        map_players.append(
            build_player_dict(
                user,
                db,
                distance_km=distance_km,
                include_coordinates=True,
            )
        )

    if latitude is not None and longitude is not None:
        map_players.sort(key=lambda player: player.get("distance_km") if player.get("distance_km") is not None else 999999)

    return map_players

>>>>>>> 02de44d (Add map page, deployment config, and fixes)

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
<<<<<<< HEAD
    
    return serialize_user(user)
=======

    return build_player_dict(user, db)

>>>>>>> 02de44d (Add map page, deployment config, and fixes)

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
<<<<<<< HEAD
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
=======
    return [build_player_dict(player, db) for player in players]

>>>>>>> 02de44d (Add map page, deployment config, and fixes)

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
