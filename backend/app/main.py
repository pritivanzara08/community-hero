from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form
from pydantic import BaseModel, EmailStr
from typing import List, Optional
# Assuming your db engine config is in backend/database.py
# from .database import get_db 
from .auth import (
    get_password_hash, 
    verify_password, 
    create_access_token, 
    get_current_user, 
    get_current_admin_user,
    get_current_citizen_user,
    TokenData
)
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

class UserResponse(BaseModel):
    username: str
    email: str
    role: str
    points: int

class IssueCreate(BaseModel):
    title: str
    description: str
    latitude: float
    longitude: float

class IssueResponse(BaseModel):
    id: int
    title: str
    description: str
    category: str
    status: str
    latitude: float
    longitude: float
    assigned_department: Optional[str]
    created_at: str
    reporter_email: Optional[str]

# --- Authentication API Routes ---

@app.post("/api/auth/register", status_code=status.HTTP_201_CREATED)
def register_user(user: UserRegister):
    """Register a new citizen user"""
    # 1. Check if user already exists in your real DB here
    # if db.query(User).filter(User.email == user.email).first():
    #     raise HTTPException(status_code=400, detail="Email already registered")
    
    # 2. Hash password
    hashed = get_password_hash(user.password)
    
    # Example DB save mock logic for presentation:
    # db_user = User(username=user.username, email=user.email, hashed_password=hashed, role="Citizen")
    # db.add(db_user)...db.commit()
    
    return {
        "message": "User registered successfully",
        "role": "Citizen",
        "email": user.email,
        "username": user.username
    }

@app.post("/api/auth/login")
def login(user: UserLogin):
    """Login user and return JWT token with role"""
    # 1. Fetch user from DB by email
    # Mocking a verified user search result here:
    # For demo: citizen@example.com = Citizen, admin@example.com = Admin
    role = "Admin" if "admin" in user.email.lower() else "Citizen"
    mock_db_user = {
        "id": 1,
        "email": user.email,
        "username": user.email.split("@")[0],
        "hashed_password": get_password_hash("password123"),
        "role": role
    }
    
    if not verify_password(user.password, mock_db_user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    # Generate JWT access token with role and user_id
    access_token = create_access_token(data={
        "sub": mock_db_user["email"],
        "role": mock_db_user["role"],
        "user_id": mock_db_user["id"]
    })
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": mock_db_user["role"],
        "username": mock_db_user["username"],
        "email": mock_db_user["email"]
    }

@app.get("/api/auth/me", response_model=UserResponse)
def get_current_user_info(current_user: TokenData = Depends(get_current_user)):
    """Get current logged-in user information"""
    return {
        "username": "demo_user",
        "email": current_user.email,
        "role": current_user.role,
        "points": 150
    }

# --- CITIZEN/USER ROUTES ---

@app.get("/api/user/dashboard")
def get_user_dashboard(current_user: TokenData = Depends(get_current_user)):
    """Get user's own reported issues and activity"""
    # Verify user is logged in
    if not current_user.email:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Fetch only issues reported by this user from DB
    # SELECT * FROM issues WHERE reporter_id = current_user.user_id
    user_issues = [
        {
            "id": 1,
            "title": "Pothole on Main Street",
            "description": "Large pothole affecting traffic",
            "category": "Road Damage",
            "status": "In Progress",
            "latitude": 40.7128,
            "longitude": -74.0060,
            "assigned_department": "Public Works",
            "created_at": "2026-06-25T10:30:00",
            "image_url": "/static/uploads/sample.jpg"
        }
    ]
    
    return {
        "user_email": current_user.email,
        "role": current_user.role,
        "issues_count": len(user_issues),
        "issues": user_issues
    }

@app.get("/api/user/issues")
def get_user_issues(current_user: TokenData = Depends(get_current_user)):
    """Get all issues reported by current user"""
    # Query: SELECT * FROM issues WHERE reporter_id = current_user.user_id
    return {
        "email": current_user.email,
        "issues": [
            {
                "id": 1,
                "title": "Issue 1",
                "status": "Pending",
                "created_at": "2026-06-25"
            }
        ]
    }

# --- ADMIN ROUTES ---

@app.get("/api/admin/dashboard")
def get_admin_dashboard(current_user: TokenData = Depends(get_current_admin_user)):
    """Get admin dashboard with all issues and statistics"""
    # Admin-only: Fetch ALL issues from DB
    # SELECT * FROM issues
    all_issues = [
        {
            "id": 1,
            "title": "Pothole on Main Street",
            "description": "Large pothole affecting traffic",
            "category": "Road Damage",
            "status": "In Progress",
            "latitude": 40.7128,
            "longitude": -74.0060,
            "assigned_department": "Public Works",
            "created_at": "2026-06-25T10:30:00",
            "reporter_email": "citizen@example.com"
        },
        {
            "id": 2,
            "title": "Broken Street Light",
            "description": "Street light not working at intersection",
            "category": "Lighting",
            "status": "Resolved",
            "latitude": 40.7150,
            "longitude": -74.0070,
            "assigned_department": "Infrastructure",
            "created_at": "2026-06-20T15:45:00",
            "reporter_email": "user@example.com"
        }
    ]
    
    return {
        "admin_email": current_user.email,
        "total_issues": len(all_issues),
        "pending_issues": sum(1 for i in all_issues if i["status"] == "Pending"),
        "in_progress_issues": sum(1 for i in all_issues if i["status"] == "In Progress"),
        "resolved_issues": sum(1 for i in all_issues if i["status"] == "Resolved"),
        "issues": all_issues
    }

@app.get("/api/admin/users")
def get_all_users(current_user: TokenData = Depends(get_current_admin_user)):
    """Get all registered users (admin only)"""
    users = [
        {"id": 1, "username": "citizen1", "email": "citizen1@example.com", "role": "Citizen", "points": 150},
        {"id": 2, "username": "citizen2", "email": "citizen2@example.com", "role": "Citizen", "points": 320}
    ]
    return {"total_users": len(users), "users": users}

@app.put("/api/admin/issue/{issue_id}/status")
def update_issue_status(
    issue_id: int,
    new_status: str,
    current_user: TokenData = Depends(get_current_admin_user)
):
    """Update issue status (admin only)"""
    # UPDATE issues SET status = new_status WHERE id = issue_id
    return {
        "message": "Issue status updated",
        "issue_id": issue_id,
        "new_status": new_status,
        "updated_by": current_user.email
    }

@app.post("/api/admin/issue/{issue_id}/assign")
def assign_issue_to_department(
    issue_id: int,
    department: str,
    current_user: TokenData = Depends(get_current_admin_user)
):
    """Assign issue to department (admin only)"""
    # UPDATE issues SET assigned_department = department WHERE id = issue_id
    return {
        "message": "Issue assigned",
        "issue_id": issue_id,
        "department": department,
        "assigned_by": current_user.email
    }


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
    """Report a new issue (authenticated users only)"""
    # 1. Trigger AI Intelligent Automation to parse description
    ai_analysis = analyze_issue(description)
    detected_category = ai_analysis["category"]
    predicted_priority = ai_analysis["priority"]
    
    # 2. Automated Department Queue Routing
    # target_department = get_assigned_department(detected_category)
    
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