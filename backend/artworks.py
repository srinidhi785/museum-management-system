from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Artwork
from schemas import ArtworkCreate, BulkArtworkCreate, BulkDelete

router = APIRouter(prefix="/artworks", tags=["Artworks"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Get all artworks
@router.get("/")
def get_artworks(db: Session = Depends(get_db)):
    return db.query(Artwork).order_by(Artwork.id.desc()).limit(100).all()


# Add one artwork
@router.post("/")
def add_artwork(artwork: ArtworkCreate, db: Session = Depends(get_db)):
    try:
        new_artwork = Artwork(
            title=artwork.title,
            artist_id=artwork.artist_id,
            department=artwork.department,
            classification=artwork.classification,
            object_date=artwork.object_date,
        )

        db.add(new_artwork)
        db.commit()
        db.refresh(new_artwork)

        return new_artwork

    except Exception as e:
        db.rollback()
        return {"error": str(e)}
    
    # Update artwork
@router.put("/{artwork_id}")
def update_artwork(
    artwork_id: int,
    artwork: ArtworkCreate,
    db: Session = Depends(get_db)
):
    try:
        existing = db.query(Artwork).filter(Artwork.id == artwork_id).first()

        if not existing:
            return {"message": "Artwork not found"}

        existing.title = artwork.title
        existing.artist_id = artwork.artist_id
        existing.department = artwork.department
        existing.classification = artwork.classification
        existing.object_date = artwork.object_date

        db.commit()
        db.refresh(existing)

        return existing

    except Exception as e:
        db.rollback()
        return {"error": str(e)}


# Bulk Insert Artworks
@router.post("/bulk")
def bulk_add_artworks(data: BulkArtworkCreate, db: Session = Depends(get_db)):
    try:
        artworks = []

        for artwork in data.artworks:
            new_artwork = Artwork(
                title=artwork.title,
                artist_id=artwork.artist_id,
                department=artwork.department,
                classification=artwork.classification,
                object_date=artwork.object_date,
            )

            db.add(new_artwork)
            artworks.append(new_artwork)

        db.commit()

        for artwork in artworks:
            db.refresh(artwork)

        return artworks

    except Exception as e:
        db.rollback()
        return {"error": str(e)}


# Bulk Delete Artworks
@router.delete("/bulk")
def bulk_delete_artworks(data: BulkDelete, db: Session = Depends(get_db)):
    try:
        deleted = 0

        for artwork_id in data.ids:
            artwork = db.query(Artwork).filter(Artwork.id == artwork_id).first()

            if artwork:
                db.delete(artwork)
                deleted += 1

        db.commit()

        return {
            "message": f"{deleted} artworks deleted successfully"
        }

    except Exception as e:
        db.rollback()
        return {"error": str(e)}


# Delete one artwork
@router.delete("/{artwork_id}")
def delete_artwork(artwork_id: int, db: Session = Depends(get_db)):
    try:
        artwork = db.query(Artwork).filter(Artwork.id == artwork_id).first()

        if artwork:
            db.delete(artwork)
            db.commit()
            return {"message": "Artwork deleted"}

        return {"message": "Artwork not found"}

    except Exception as e:
        db.rollback()
        return {"error": str(e)}