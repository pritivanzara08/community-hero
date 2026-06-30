from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form
from pydantic import BaseModel, EmailStr
from typing import List
# Assuming your db engine config is in backend/database.py
# from .database import get_db 
from .auth import get_password_hash, verify_password, create_access_token, get_current_user, TokenData
from .ai_engine import analyze_issue
import os
import shutil

app = FastAPI(title="Community Hero API")

# Ensure local media directories exist for storing user evidence
UPLOAD_DIR = "static/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# --- Pydantic Schemas ---
class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class IssueCreate(BaseModel):
    title: str
    description: str
    latitude: float
    longitude: float

# --- Authentication API Routes ---

@app.post("/api/auth/register", status_code=status.HTTP_201_CREATED)
def register_user(user: UserRegister):
    # 1. Check if user already exists in your real DB here
    # 2. Hash password
    hashed = get_password_hash(user.password)
    
    # Example DB save mock logic for presentation:
    # db_user = User(username=user.username, email=user.email, hashed_password=hashed)
    # db.add(db_user)...db.commit()
    
    return {"message": "User registered successfully"}

@app.post("/api/auth/login")
def login(user: UserLogin):
    # 1. Fetch user from DB by email
    # Mocking a verified user search result here:
    mock_db_user = {"email": user.email, "hashed_password": get_password_hash("password123"), "role": "Citizen"}
    
    if not verify_password(user.password, mock_db_user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    # Generate true JWT access token
    access_token = create_access_token(data={"sub": mock_db_user["email"], "role": mock_db_user["role"]})
    return {"access_token": access_token, "token_type": "bearer"}


# --- Protected Issue Reporting Route ---
@app.post("/api/issues/", status_code=status.HTTP_201_CREATED)
async def report_issue(
    title: str = Form(...),
    description: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    image: UploadFile = File(None),
    current_user: TokenData = Depends(get_current_user)
):
    # 1. Trigger AI Intelligent Automation to parse description
    ai_analysis = analyze_issue(description)
    detected_category = ai_analysis["category"]
    predicted_priority = ai_analysis["priority"]
    
    # 2. Automated Department Queue Routing
    target_department = get_assigned_department(detected_category)
    
    # 3. Handle File Upload if visual evidence is provided
    saved_file_path = None
    if image:
        file_extension = os.path.splitext(image.filename)[1]
        # Secure unique name formatting
        unique_filename = f"issue_{current_user.email.split('@')[0]}_{os.urandom(4).hex()}{file_extension}"
        saved_file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        with open(saved_file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

    # Compile the comprehensive, automated record structure
    new_issue_record = {
        "title": title,
        "description": description,
        "latitude": latitude,
        "longitude": longitude,
        "category": detected_category,      # Filled by AI
        "priority": predicted_priority,      # Filled by AI
        "assigned_department": target_department, # Sorted by Auto-routing
        "reporter": current_user.email,
        "image_url": f"/{saved_file_path}" if saved_file_path else None,
        "status": "Pending Verification"
    }
    
    # In your real setup: db.add(Issue(**new_issue_record)) -> db.commit()
    
    return {
        "status": "Success",
        "message": "AI categorized and routed your ticket efficiently.",
        "data": new_issue_record
    }