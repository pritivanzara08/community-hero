from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum("citizen", "admin", "department"), default="citizen")
    points = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now())

    issues = relationship("Issue", back_populates="reporter")
    votes = relationship("Vote", back_populates="user")
    comments = relationship("Comment", back_populates="user")


class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    contact_email = Column(String(120))
    phone = Column(String(20))
    created_at = Column(DateTime, server_default=func.now())

    issues = relationship("Issue", back_populates="department")


class Issue(Base):
    __tablename__ = "issues"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    description = Column(Text)
    category = Column(String(80))
    ai_category = Column(String(80))
    status = Column(
        Enum("Reported", "Verified", "Assigned", "In Progress", "Resolved", "Rejected"),
        default="Reported"
    )
    priority = Column(Enum("Low", "Normal", "High", "Critical"), default="Normal")
    latitude = Column(Float)
    longitude = Column(Float)
    address = Column(String(255))

    reported_by = Column(Integer, ForeignKey("users.id"))
    assigned_department_id = Column(Integer, ForeignKey("departments.id"))

    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    resolved_at = Column(DateTime, nullable=True)

    reporter = relationship("User", back_populates="issues")
    department = relationship("Department", back_populates="issues")
    images = relationship("IssueImage", back_populates="issue")
    votes = relationship("Vote", back_populates="issue")
    comments = relationship("Comment", back_populates="issue")
    status_updates = relationship("StatusUpdate", back_populates="issue")


class IssueImage(Base):
    __tablename__ = "issue_images"

    id = Column(Integer, primary_key=True, index=True)
    issue_id = Column(Integer, ForeignKey("issues.id"))
    file_path = Column(String(255), nullable=False)
    file_type = Column(Enum("image", "video"), default="image")
    uploaded_at = Column(DateTime, server_default=func.now())

    issue = relationship("Issue", back_populates="images")


class Vote(Base):
    __tablename__ = "votes"

    id = Column(Integer, primary_key=True, index=True)
    issue_id = Column(Integer, ForeignKey("issues.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    vote_type = Column(Enum("verify", "duplicate", "false_report"), default="verify")
    created_at = Column(DateTime, server_default=func.now())

    issue = relationship("Issue", back_populates="votes")
    user = relationship("User", back_populates="votes")


class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    issue_id = Column(Integer, ForeignKey("issues.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    comment_text = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    issue = relationship("Issue", back_populates="comments")
    user = relationship("User", back_populates="comments")


class StatusUpdate(Base):
    __tablename__ = "status_updates"

    id = Column(Integer, primary_key=True, index=True)
    issue_id = Column(Integer, ForeignKey("issues.id"))
    updated_by = Column(Integer, ForeignKey("users.id"))
    old_status = Column(String(50))
    new_status = Column(String(50), nullable=False)
    note = Column(Text)
    created_at = Column(DateTime, server_default=func.now())

    issue = relationship("Issue", back_populates="status_updates")


class Reward(Base):
    __tablename__ = "rewards"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    points = Column(Integer, nullable=False)
    reason = Column(String(255))
    created_at = Column(DateTime, server_default=func.now())