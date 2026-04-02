from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import User, UserSport
from schemas import UserResponse, UserUpdate, PlayerResponse, UserSportResponse, UserSportCreate
from auth import get_current_user

router = APIRouter()

@router.get("/me", response_model=PlayerResponse)
def get_current_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Manually construct response with sports
    user_dict = {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "city": current_user.city,
        "bio": current_user.bio,
        "avatar": current_user.avatar,
        "created_at": current_user.created_at,
        "email_notifications": current_user.email_notifications,
        "push_notifications": current_user.push_notifications,
        "match_suggestions": current_user.match_suggestions,
        "profile_visible": current_user.profile_visible,
        "show_online_status": current_user.show_online_status,
        "sports": [{"id": s.id, "user_id": s.user_id, "sport_name": s.sport_name, "skill_level": s.skill_level} for s in current_user.sports]
    }
    
    return user_dict

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
    if user_update.avatar is not None:
        current_user.avatar = user_update.avatar
    
    db.commit()
    db.refresh(current_user)
    
    # Manually construct response with sports
    user_dict = {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "city": current_user.city,
        "bio": current_user.bio,
        "avatar": current_user.avatar,
        "created_at": current_user.created_at,
        "email_notifications": current_user.email_notifications,
        "push_notifications": current_user.push_notifications,
        "match_suggestions": current_user.match_suggestions,
        "profile_visible": current_user.profile_visible,
        "show_online_status": current_user.show_online_status,
        "sports": [{"id": s.id, "user_id": s.user_id, "sport_name": s.sport_name, "skill_level": s.skill_level} for s in current_user.sports]
    }
    
    return user_dict

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
    
    # Manually construct response with sports
    user_dict = {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "full_name": user.full_name,
        "city": user.city,
        "bio": user.bio,
        "avatar": user.avatar,
        "created_at": user.created_at,
        "email_notifications": user.email_notifications,
        "push_notifications": user.push_notifications,
        "match_suggestions": user.match_suggestions,
        "profile_visible": user.profile_visible,
        "show_online_status": user.show_online_status,
        "sports": [{"id": s.id, "user_id": s.user_id, "sport_name": s.sport_name, "skill_level": s.skill_level} for s in user.sports]
    }
    
    return user_dict

@router.get("/", response_model=List[PlayerResponse])
def search_players(
    city: str = None,
    sport: str = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(User).filter(User.id != current_user.id)
    
    if city:
        query = query.filter(User.city == city)
    
    if sport:
        query = query.join(UserSport).filter(UserSport.sport_name == sport)
    
    players = query.all()
    return players

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
