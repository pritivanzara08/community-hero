from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/issues", tags=["Issues"])


def ai_categorize_issue(text: str):
    text = text.lower()

    if "pothole" in text or "road" in text:
        return "Road Damage"
    if "water" in text or "leak" in text:
        return "Water Leakage"
    if "garbage" in text or "waste" in text:
        return "Waste Management"
    if "streetlight" in text or "light" in text:
        return "Streetlight Issue"

    return "General Civic Issue"


@router.post("/report")
def report_issue(issue: schemas.IssueCreate, db: Session = Depends(get_db)):
    reporter = db.query(models.User).filter(models.User.id == issue.reported_by).first()

    if not reporter:
        raise HTTPException(status_code=404, detail="Reporter not found")

    ai_category = ai_categorize_issue(f"{issue.title} {issue.description or ''}")

    new_issue = models.Issue(
        title=issue.title,
        description=issue.description,
        category=issue.category,
        ai_category=ai_category,
        latitude=issue.latitude,
        longitude=issue.longitude,
        address=issue.address,
        reported_by=issue.reported_by
    )

    reporter.points += 10

    db.add(new_issue)
    db.commit()
    db.refresh(new_issue)

    return {
        "message": "Issue reported successfully",
        "issue_id": new_issue.id,
        "ai_category": ai_category
    }


@router.get("/")
def get_issues(db: Session = Depends(get_db)):
    return db.query(models.Issue).all()


@router.get("/{issue_id}")
def get_issue(issue_id: int, db: Session = Depends(get_db)):
    issue = db.query(models.Issue).filter(models.Issue.id == issue_id).first()

    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")

    return issue


@router.put("/{issue_id}/status")
def update_issue_status(
    issue_id: int,
    status_data: schemas.IssueStatusUpdate,
    db: Session = Depends(get_db)
):
    issue = db.query(models.Issue).filter(models.Issue.id == issue_id).first()

    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")

    old_status = issue.status
    issue.status = status_data.status

    status_update = models.StatusUpdate(
        issue_id=issue_id,
        updated_by=status_data.updated_by,
        old_status=old_status,
        new_status=status_data.status,
        note=status_data.note
    )

    db.add(status_update)
    db.commit()

    return {"message": "Issue status updated successfully"}


@router.post("/{issue_id}/verify")
def verify_issue(issue_id: int, user_id: int, db: Session = Depends(get_db)):
    issue = db.query(models.Issue).filter(models.Issue.id == issue_id).first()
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    existing_vote = db.query(models.Vote).filter(
        models.Vote.issue_id == issue_id,
        models.Vote.user_id == user_id,
        models.Vote.vote_type == "verify"
    ).first()

    if existing_vote:
        raise HTTPException(status_code=400, detail="User already verified this issue")

    vote = models.Vote(
        issue_id=issue_id,
        user_id=user_id,
        vote_type="verify"
    )

    user.points += 3

    db.add(vote)
    db.commit()

    verify_count = db.query(models.Vote).filter(
        models.Vote.issue_id == issue_id,
        models.Vote.vote_type == "verify"
    ).count()

    if verify_count >= 5 and issue.status == "Reported":
        issue.status = "Verified"
        db.commit()

    return {
        "message": "Issue verified successfully",
        "verify_count": verify_count
    }


@router.post("/{issue_id}/comment")
def add_comment(
    issue_id: int,
    comment: schemas.IssueCommentCreate,
    db: Session = Depends(get_db)
):
    issue = db.query(models.Issue).filter(models.Issue.id == issue_id).first()

    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")

    new_comment = models.Comment(
        issue_id=issue_id,
        user_id=comment.user_id,
        comment_text=comment.comment_text
    )

    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)

    return {"message": "Comment added successfully"}