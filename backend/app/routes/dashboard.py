from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from ..database import get_db
from .. import models

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    total_issues = db.query(models.Issue).count()
    reported = db.query(models.Issue).filter(models.Issue.status == "Reported").count()
    in_progress = db.query(models.Issue).filter(models.Issue.status == "In Progress").count()
    resolved = db.query(models.Issue).filter(models.Issue.status == "Resolved").count()
    total_users = db.query(models.User).count()

    return {
        "total_issues": total_issues,
        "reported": reported,
        "in_progress": in_progress,
        "resolved": resolved,
        "total_users": total_users
    }


@router.get("/category-summary")
def category_summary(db: Session = Depends(get_db)):
    data = db.query(
        models.Issue.ai_category,
        func.count(models.Issue.id)
    ).group_by(models.Issue.ai_category).all()

    return [
        {"category": category, "count": count}
        for category, count in data
    ]


@router.get("/location-hotspots")
def location_hotspots(db: Session = Depends(get_db)):
    data = db.query(
        func.round(models.Issue.latitude, 2).label("lat"),
        func.round(models.Issue.longitude, 2).label("lng"),
        func.count(models.Issue.id).label("count")
    ).group_by("lat", "lng").having(func.count(models.Issue.id) >= 2).all()

    return [
        {"latitude": lat, "longitude": lng, "issue_count": count}
        for lat, lng, count in data
    ]