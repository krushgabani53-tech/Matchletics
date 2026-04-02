from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import User, Message
from schemas import DashboardStats
from auth import get_current_user

router = APIRouter()

@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    total_messages_sent = db.query(Message).filter(Message.sender_id == current_user.id).count()
    total_messages_received = db.query(Message).filter(Message.receiver_id == current_user.id).count()
    unread_messages = db.query(Message).filter(
        Message.receiver_id == current_user.id,
        Message.is_read == False
    ).count()
    
    # Count unique users the current user has messaged with
    sent_to = db.query(Message.receiver_id).filter(Message.sender_id == current_user.id).distinct().all()
    received_from = db.query(Message.sender_id).filter(Message.receiver_id == current_user.id).distinct().all()
    
    unique_connections = set([user_id[0] for user_id in sent_to] + [user_id[0] for user_id in received_from])
    total_connections = len(unique_connections)
    
    return DashboardStats(
        total_messages_sent=total_messages_sent,
        total_messages_received=total_messages_received,
        unread_messages=unread_messages,
        total_connections=total_connections
    )
