import html
import os
from pathlib import Path
import shutil

from fastapi import FastAPI, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .database import Base, engine
from . import models
from .routes import users, issues, dashboard


Base.metadata.create_all(bind=engine)

app = FastAPI(title="Community Hero API")

# create folder to store uploaded files if it doesn't exist
os.makedirs("uploads", exist_ok=True)

# Mount the static files directory for serving uploaded files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(issues.router)
app.include_router(dashboard.router)

@app.get("/api/health")
def health():
    return {"message": "Community Hero API is running"}

FRONTEND_DIR = Path(__file__).resolve().parents[2] / "frontend"

@app.post("/api/submit-issue")
async def create_issue(
    issue: str = Form(...),
    description: str = Form(..., description="The issue description"),
    category: str = Form(..., description="The issue category"),
    latitude: float = Form(..., description="The latitude of the issue location"),
    longitude: float = Form(..., description="The longitude of the issue location"),
    image: UploadFile = Form(..., description="The base64-encoded image of the issue")
):
    image_url = None
    if image:
        file_location = f"uploads/{image.filename}"
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        image_url = f"/{file_location}"

    # ToDo : save this data to your database using existing models and database session
    new_issue = {
        "title": issue,
        "description": description,
        "category": category,
        "latitude": latitude,
        "longitude": longitude,
        "image_url": image_url,
        "status": "Pending"  # Default status for new issues
    }

    return {"message": "Issue submitted successfully", "issue": new_issue}