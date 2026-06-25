from typing import Optional
from pydantic import BaseModel, EmailStr, field_validator, model_validator


class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    confirm_password: str

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, full_name):
        full_name = full_name.strip()
        if len(full_name) < 5:
            raise ValueError("Full name must be at least 5 characters")
        return full_name

    @field_validator("password")
    @classmethod
    def validate_password(cls, password):
        if len(password) < 8:
            raise ValueError("Password must be at least 8 characters long")
        
        if not any(char.isdigit() for char in password):
            raise ValueError("Password must contain at least one number")
        
        if not any(char.isalpha() for char in password):
            raise ValueError("Password must contain at least one letter")
        return password

    @model_validator(mode="after")
    def validate_passwords_match(self):
        if self.password != self.confirm_password:
            raise ValueError("Passwords do not match")
        return self


class UserLogin(BaseModel):
    email: EmailStr
    password: str
    
class IssueCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category: str
    latitude: float
    longitude: float
    address: str
    reported_by: int  # User ID of the reporter

class IssueStatusUpdate(BaseModel):
    status: str
    updated_by: int  # User ID of the person updating the status
    note: Optional[str] = None

class IssueCommentCreate(BaseModel):
    user_id: int
    comment_text: str
