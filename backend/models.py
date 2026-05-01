from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(80), unique=True, nullable=False, index=True)
    email = Column(String(120), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(120))
    city = Column(String(100))
    bio = Column(Text)
    avatar = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Settings
    email_notifications = Column(Boolean, default=True)
    push_notifications = Column(Boolean, default=True)
    match_suggestions = Column(Boolean, default=False)
    profile_visible = Column(Boolean, default=True)
    show_online_status = Column(Boolean, default=True)
    
    # Relationships
    messages_sent = relationship("Message", foreign_keys="Message.sender_id", back_populates="sender")
    messages_received = relationship("Message", foreign_keys="Message.receiver_id", back_populates="receiver")
    sports = relationship("UserSport", back_populates="user", cascade="all, delete-orphan")
    location = relationship("UserLocation", back_populates="user", uselist=False, cascade="all, delete-orphan")

class UserSport(Base):
    __tablename__ = "user_sports"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    sport_name = Column(String(50), nullable=False)
    skill_level = Column(String(20))  # Beginner, Intermediate, Advanced
    
    user = relationship("User", back_populates="sports")


class UserLocation(Base):
    __tablename__ = "user_locations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    latitude = Column(Float, nullable=False, index=True)
    longitude = Column(Float, nullable=False, index=True)
    sharing_enabled = Column(Boolean, default=True, nullable=False, index=True)
    last_updated = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    user = relationship("User", back_populates="location")

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    content = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    sender = relationship("User", foreign_keys=[sender_id], back_populates="messages_sent")
    receiver = relationship("User", foreign_keys=[receiver_id], back_populates="messages_received")

class Event(Base):
    __tablename__ = "events"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    sport = Column(String(50), nullable=False)
    city = Column(String(100), nullable=False)
    date = Column(String(20), nullable=False)
    time = Column(String(10), nullable=False)
    max_players = Column(Integer, default=10)
    description = Column(Text)
    organizer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    organizer = relationship("User")
    participants = relationship("EventParticipant", back_populates="event", cascade="all, delete-orphan")

class EventParticipant(Base):
    __tablename__ = "event_participants"
    
    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    joined_at = Column(DateTime, default=datetime.utcnow)
    
    event = relationship("Event", back_populates="participants")
    user = relationship("User")
