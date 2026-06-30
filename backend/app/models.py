from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime, timezone

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="Citizen")  # Roles: Citizen, Moderator, Department_Admin
    points = Column(Integer, default=0)        # Gamification core

class Issue(Base):
    __tablename__ = "issues"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    category = Column(String, nullable=False)
    
    # Geolocation fields
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    
    status = Column(String, default="Pending") # Pending, Verified, Resolved
    assigned_department = Column(String, nullable=True) # For future auto-routing
    
    reporter_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))