from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models import User, Event, EventParticipant
from schemas import EventCreate, EventResponse, EventUpdate
from auth import get_current_user

router = APIRouter()

@router.post("/", response_model=EventResponse, status_code=status.HTTP_201_CREATED)
def create_event(
    event_data: EventCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_event = Event(
        title=event_data.title,
        sport=event_data.sport,
        city=event_data.city,
        date=event_data.date,
        time=event_data.time,
        max_players=event_data.max_players,
        description=event_data.description,
        organizer_id=current_user.id
    )
    
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    
    # Add organizer as first participant
    participant = EventParticipant(
        event_id=new_event.id,
        user_id=current_user.id
    )
    db.add(participant)
    db.commit()
    
    # Get participant IDs
    participant_ids = [p.user_id for p in new_event.participants]
    
    # Return event with participants
    event_dict = {
        "id": new_event.id,
        "title": new_event.title,
        "sport": new_event.sport,
        "city": new_event.city,
        "date": new_event.date,
        "time": new_event.time,
        "max_players": new_event.max_players,
        "description": new_event.description,
        "organizer_id": new_event.organizer_id,
        "created_at": new_event.created_at,
        "participants": participant_ids
    }
    
    return event_dict

@router.get("/", response_model=List[EventResponse])
def get_events(
    city: Optional[str] = None,
    sport: Optional[str] = None,
    db: Session = Depends(get_db)
):
    from datetime import datetime, date
    
    query = db.query(Event)
    
    if city:
        query = query.filter(Event.city == city)
    
    if sport:
        query = query.filter(Event.sport == sport)
    
    events = query.order_by(Event.date.asc(), Event.time.asc()).all()
    
    # Filter out expired events and add participant IDs
    result = []
    today = date.today()
    
    for event in events:
        # Parse event date (format: YYYY-MM-DD)
        try:
            event_date = datetime.strptime(event.date, '%Y-%m-%d').date()
            
            # Skip events that have already passed
            if event_date < today:
                continue
                
        except ValueError:
            # If date parsing fails, include the event (don't break functionality)
            pass
        
        participant_ids = [p.user_id for p in event.participants]
        event_dict = {
            "id": event.id,
            "title": event.title,
            "sport": event.sport,
            "city": event.city,
            "date": event.date,
            "time": event.time,
            "max_players": event.max_players,
            "description": event.description,
            "organizer_id": event.organizer_id,
            "created_at": event.created_at,
            "participants": participant_ids
        }
        result.append(event_dict)
    
    return result

@router.get("/{event_id}", response_model=EventResponse)
def get_event(
    event_id: int,
    db: Session = Depends(get_db)
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    # Get participant IDs
    participant_ids = [p.user_id for p in event.participants]
    
    event_dict = {
        "id": event.id,
        "title": event.title,
        "sport": event.sport,
        "city": event.city,
        "date": event.date,
        "time": event.time,
        "max_players": event.max_players,
        "description": event.description,
        "organizer_id": event.organizer_id,
        "created_at": event.created_at,
        "participants": participant_ids
    }
    
    return event_dict

@router.put("/{event_id}", response_model=EventResponse)
def update_event(
    event_id: int,
    event_update: EventUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    event = db.query(Event).filter(Event.id == event_id).first()
    
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    if event.organizer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the organizer can update this event"
        )
    
    if event_update.title is not None:
        event.title = event_update.title
    if event_update.description is not None:
        event.description = event_update.description
    if event_update.date is not None:
        event.date = event_update.date
    if event_update.time is not None:
        event.time = event_update.time
    if event_update.max_players is not None:
        event.max_players = event_update.max_players
    
    db.commit()
    db.refresh(event)
    
    # Get participant IDs
    participant_ids = [p.user_id for p in event.participants]
    
    event_dict = {
        "id": event.id,
        "title": event.title,
        "sport": event.sport,
        "city": event.city,
        "date": event.date,
        "time": event.time,
        "max_players": event.max_players,
        "description": event.description,
        "organizer_id": event.organizer_id,
        "created_at": event.created_at,
        "participants": participant_ids
    }
    
    return event_dict

@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(
    event_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    event = db.query(Event).filter(Event.id == event_id).first()
    
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    if event.organizer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the organizer can delete this event"
        )
    
    db.delete(event)
    db.commit()
    return None

@router.post("/{event_id}/join", response_model=dict)
def join_event(
    event_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    event = db.query(Event).filter(Event.id == event_id).first()
    
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    # Check if already joined
    existing = db.query(EventParticipant).filter(
        EventParticipant.event_id == event_id,
        EventParticipant.user_id == current_user.id
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already joined this event"
        )
    
    # Check if event is full
    participant_count = db.query(EventParticipant).filter(
        EventParticipant.event_id == event_id
    ).count()
    
    if participant_count >= event.max_players:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Event is full"
        )
    
    participant = EventParticipant(
        event_id=event_id,
        user_id=current_user.id
    )
    
    db.add(participant)
    db.commit()
    
    # Refresh to get updated participants
    db.refresh(event)
    participant_ids = [p.user_id for p in event.participants]
    
    return {
        "message": "Successfully joined event",
        "participants": participant_ids
    }

@router.post("/{event_id}/leave", response_model=dict)
def leave_event(
    event_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    event = db.query(Event).filter(Event.id == event_id).first()
    
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    if event.organizer_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Organizer cannot leave their own event. Delete it instead."
        )
    
    participant = db.query(EventParticipant).filter(
        EventParticipant.event_id == event_id,
        EventParticipant.user_id == current_user.id
    ).first()
    
    if not participant:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Not a participant of this event"
        )
    
    db.delete(participant)
    db.commit()
    
    # Refresh to get updated participants
    db.refresh(event)
    participant_ids = [p.user_id for p in event.participants]
    
    return {
        "message": "Successfully left event",
        "participants": participant_ids
    }

@router.get("/{event_id}/participants", response_model=List[dict])
def get_event_participants(
    event_id: int,
    db: Session = Depends(get_db)
):
    event = db.query(Event).filter(Event.id == event_id).first()
    
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    participants = db.query(User).join(EventParticipant).filter(
        EventParticipant.event_id == event_id
    ).all()
    
    return [
        {
            "id": p.id,
            "username": p.username,
            "full_name": p.full_name,
            "avatar": p.avatar
        }
        for p in participants
    ]

@router.delete("/cleanup-expired", status_code=status.HTTP_200_OK)
def cleanup_expired_events(db: Session = Depends(get_db)):
    """
    Delete events that have already passed.
    This endpoint can be called manually or scheduled to run periodically.
    """
    from datetime import datetime, date
    
    today = date.today()
    deleted_count = 0
    
    # Get all events
    events = db.query(Event).all()
    
    for event in events:
        try:
            event_date = datetime.strptime(event.date, '%Y-%m-%d').date()
            
            # Delete if event date has passed
            if event_date < today:
                db.delete(event)
                deleted_count += 1
                
        except ValueError:
            # Skip events with invalid date format
            continue
    
    db.commit()
    
    return {
        "message": f"Cleanup completed",
        "deleted_events": deleted_count
    }
