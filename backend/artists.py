from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Artist
from schemas import ArtistCreate, BulkArtistCreate, BulkDelete

router = APIRouter(prefix="/artists", tags=["Artists"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Get all artists
@router.get("/")
def get_artists(db: Session = Depends(get_db)):
    return db.query(Artist).order_by(Artist.id.desc()).limit(20).all()


# Add one artist
@router.post("/")
def add_artist(artist: ArtistCreate, db: Session = Depends(get_db)):
    try:
        new_artist = Artist(
            name=artist.name,
            nationality=artist.nationality,
            gender=artist.gender,
            birth_year=artist.birth_year,
            death_year=artist.death_year,
        )

        db.add(new_artist)
        db.commit()
        db.refresh(new_artist)

        return new_artist

    except Exception as e:
        db.rollback()
        return {"error": str(e)}
    
@router.put("/{artist_id}")
def update_artist(
    artist_id: int,
    artist: ArtistCreate,
    db: Session = Depends(get_db)
):
    try:
        existing_artist = db.query(Artist).filter(Artist.id == artist_id).first()

        if not existing_artist:
            return {"message": "Artist not found"}

        existing_artist.name = artist.name
        existing_artist.nationality = artist.nationality
        existing_artist.gender = artist.gender
        existing_artist.birth_year = artist.birth_year
        existing_artist.death_year = artist.death_year

        db.commit()
        db.refresh(existing_artist)

        return existing_artist

    except Exception as e:
        db.rollback()
        return {"error": str(e)}


# Bulk Insert Artists
@router.post("/bulk")
def bulk_add_artists(data: BulkArtistCreate, db: Session = Depends(get_db)):
    try:
        artists = []

        for artist in data.artists:
            new_artist = Artist(
                name=artist.name,
                nationality=artist.nationality,
                gender=artist.gender,
                birth_year=artist.birth_year,
                death_year=artist.death_year,
            )

            db.add(new_artist)
            artists.append(new_artist)

        db.commit()

        for artist in artists:
            db.refresh(artist)

        return artists

    except Exception as e:
        db.rollback()
        print("BULK ARTIST ERROR:", e)
        return {"error": str(e)}


# Bulk Delete Artists
@router.delete("/bulk")
def bulk_delete_artists(data: BulkDelete, db: Session = Depends(get_db)):
    try:
        deleted = 0

        for artist_id in data.ids:
            artist = db.query(Artist).filter(Artist.id == artist_id).first()

            if artist:
                db.delete(artist)
                deleted += 1

        db.commit()

        return {
            "message": f"{deleted} artists deleted successfully"
        }

    except Exception as e:
        db.rollback()
        return {"error": str(e)}


# Delete one artist
@router.delete("/{artist_id}")
def delete_artist(artist_id: int, db: Session = Depends(get_db)):
    try:
        artist = db.query(Artist).filter(Artist.id == artist_id).first()

        if artist:
            db.delete(artist)
            db.commit()
            return {"message": "Artist deleted"}

        return {"message": "Artist not found"}

    except Exception as e:
        db.rollback()
        print("DELETE ERROR:", e)
        return {"error": str(e)}