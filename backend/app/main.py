import html
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .database import Base, engine
from . import models
from .routes import users, issues, dashboard


Base.metadata.create_all(bind=engine)

app = FastAPI(title="Community Hero API")

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
app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")