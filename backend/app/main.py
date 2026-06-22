from fastapi import FastAPI
from .database import Base, engine
from . import models
from .routes import users, issues, dashboard

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Community Hero API")

app.include_router(users.router)
app.include_router(issues.router)
app.include_router(dashboard.router)

@app.get("/")
def home():
    return {"message": "Community Hero API is running"}