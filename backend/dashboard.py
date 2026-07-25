from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import SessionLocal
from models import Artist, Artwork

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/")
def get_dashboard(db: Session = Depends(get_db)):
    total_artists = db.query(Artist).count()
    total_artworks = db.query(Artwork).count()

    return {
        "total_artists": total_artists,
        "total_artworks": total_artworks
    }


@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_artists = db.query(Artist).count()
    total_artworks = db.query(Artwork).count()

    total_departments = (
        db.query(func.count(func.distinct(Artwork.department)))
        .scalar()
    )

    return {
        "total_artists": total_artists,
        "total_artworks": total_artworks,
        "total_departments": total_departments
    }