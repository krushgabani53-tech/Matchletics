from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: Optional[str] = None
    city: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str  # Can be username or email
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    city: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    avatar: Optional[str] = None

class UserResponse(UserBase):
    id: int
    bio: Optional[str] = None
    avatar: Optional[str] = None
    created_at: datetime
    email_notifications: bool
    push_notifications: bool
    match_suggestions: bool
    profile_visible: bool
    show_online_status: bool
    location_sharing_enabled: bool = True
    primary_sport: Optional[str] = None
    distance_km: Optional[float] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    
    class Config:
        from_attributes = True

# Sport Schemas
class UserSportBase(BaseModel):
    sport_name: str
    skill_level: Optional[str] = None

class UserSportCreate(UserSportBase):
    pass

class UserSportResponse(UserSportBase):
    id: int
    user_id: int
    
    class Config:
        from_attributes = True

# Message Schemas
class MessageCreate(BaseModel):
    receiver_id: int
    content: str

class MessageResponse(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    content: str
    is_read: bool
    created_at: datetime
    sender_username: Optional[str] = None
    receiver_username: Optional[str] = None
    
    class Config:
        from_attributes = True

# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[int] = None

# Settings Schemas
class PasswordChange(BaseModel):
    current_password: str
    new_password: str

class EmailChange(BaseModel):
    new_email: EmailStr

class NotificationSettings(BaseModel):
    email_notifications: bool
    push_notifications: bool
    match_suggestions: bool

class PrivacySettings(BaseModel):
    profile_visible: bool
    show_online_status: bool
    location_sharing_enabled: bool = True


class LocationUpdate(BaseModel):
    latitude: float
    longitude: float
    sharing_enabled: Optional[bool] = None

# Dashboard Schemas
class DashboardStats(BaseModel):
    total_messages_sent: int
    total_messages_received: int
    unread_messages: int
    total_connections: int

class PlayerSearchParams(BaseModel):
    city: Optional[str] = None
    sport: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    radius_km: Optional[float] = None

class PlayerResponse(UserResponse):
    sports: List[UserSportResponse] = []
    distance_km: Optional[float] = None
    
    class Config:
        from_attributes = True

# Event Schemas
class EventCreate(BaseModel):
    title: str
    sport: str
    city: str
    date: str
    time: str
    max_players: int = 10
    description: Optional[str] = None

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None
    max_players: Optional[int] = None

class EventResponse(BaseModel):
    id: int
    title: str
    sport: str
    city: str
    date: str
    time: str
    max_players: int
    description: Optional[str] = None
    organizer_id: int
    created_at: datetime
    participants: List[int] = []
    
    class Config:
        from_attributes = True
