from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import PasswordChange, EmailChange, NotificationSettings, PrivacySettings, UserResponse
from auth import get_current_user, get_password_hash, verify_password

router = APIRouter()

@router.put("/password", response_model=dict)
def change_password(
    password_data: PasswordChange,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not verify_password(password_data.current_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    current_user.password_hash = get_password_hash(password_data.new_password)
    db.commit()
    
    return {"message": "Password updated successfully"}

@router.put("/email", response_model=dict)
def change_email(
    email_data: EmailChange,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if email already exists
    existing_user = db.query(User).filter(
        User.email == email_data.new_email,
        User.id != current_user.id
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already in use"
        )
    
    current_user.email = email_data.new_email
    db.commit()
    
    return {"message": "Email updated successfully"}

@router.put("/notifications", response_model=UserResponse)
def update_notification_settings(
    settings: NotificationSettings,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    current_user.email_notifications = settings.email_notifications
    current_user.push_notifications = settings.push_notifications
    current_user.match_suggestions = settings.match_suggestions
    
    db.commit()
    db.refresh(current_user)
    
    return current_user

@router.put("/privacy", response_model=UserResponse)
def update_privacy_settings(
    settings: PrivacySettings,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    current_user.profile_visible = settings.profile_visible
    current_user.show_online_status = settings.show_online_status
    
    db.commit()
    db.refresh(current_user)
    
    return current_user

@router.delete("/account", status_code=status.HTTP_204_NO_CONTENT)
def delete_account(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db.delete(current_user)
    db.commit()
    return None
