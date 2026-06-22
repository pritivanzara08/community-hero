from pydantic import BaseModel
from typing import Optional


class UserRegister(BaseModel):
    full_name: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class IssueCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    address: Optional[str] = None
    reported_by: int


class IssueStatusUpdate(BaseModel):
    status: str
    updated_by: int
    note: Optional[str] = None


class IssueCommentCreate(BaseModel):
    user_id: int
    comment_text: str