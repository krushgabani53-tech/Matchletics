from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import User, Message
from schemas import MessageCreate, MessageResponse
from auth import get_current_user

router = APIRouter()

@router.post("/", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def send_message(
    message_data: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if receiver exists
    receiver = db.query(User).filter(User.id == message_data.receiver_id).first()
    if not receiver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Receiver not found"
        )
    
    new_message = Message(
        sender_id=current_user.id,
        receiver_id=message_data.receiver_id,
        content=message_data.content
    )
    
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    
    # Add sender and receiver usernames
    response = MessageResponse.from_orm(new_message)
    response.sender_username = current_user.username
    response.receiver_username = receiver.username
    
    return response

@router.get("/", response_model=List[MessageResponse])
def get_messages(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    messages = db.query(Message).filter(
        (Message.sender_id == current_user.id) | (Message.receiver_id == current_user.id)
    ).order_by(Message.created_at.desc()).all()
    
    # Add usernames
    result = []
    for msg in messages:
        msg_dict = MessageResponse.from_orm(msg)
        msg_dict.sender_username = msg.sender.username
        msg_dict.receiver_username = msg.receiver.username
        result.append(msg_dict)
    
    return result

@router.get("/conversations")
def get_conversations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get all messages involving current user
    messages = db.query(Message).filter(
        (Message.sender_id == current_user.id) | (Message.receiver_id == current_user.id)
    ).order_by(Message.created_at.desc()).all()
    
    # Group by conversation partner
    conversations = {}
    for msg in messages:
        other_user_id = msg.receiver_id if msg.sender_id == current_user.id else msg.sender_id
        
        if other_user_id not in conversations:
            other_user = db.query(User).filter(User.id == other_user_id).first()
            unread_count = db.query(Message).filter(
                Message.sender_id == other_user_id,
                Message.receiver_id == current_user.id,
                Message.is_read == False
            ).count()
            
            conversations[other_user_id] = {
                "user_id": other_user.id,
                "username": other_user.username,
                "full_name": other_user.full_name,
                "avatar": other_user.avatar,
                "last_message": msg.content,
                "last_message_time": msg.created_at,
                "is_sender": msg.sender_id == current_user.id,
                "unread_count": unread_count
            }
    
    return list(conversations.values())

@router.put("/{message_id}/read", response_model=MessageResponse)
def mark_message_as_read(
    message_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    message = db.query(Message).filter(Message.id == message_id).first()
    
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    
    if message.receiver_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to mark this message as read"
        )
    
    message.is_read = True
    db.commit()
    db.refresh(message)
    
    response = MessageResponse.from_orm(message)
    response.sender_username = message.sender.username
    response.receiver_username = message.receiver.username
    
    return response
