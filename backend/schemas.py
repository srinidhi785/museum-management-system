from pydantic import BaseModel
from typing import Optional


# ---------- Artist ----------

class ArtistCreate(BaseModel):
    name: str
    nationality: str
    gender: str
    birth_year: int
    death_year: Optional[int] = None


class ArtistResponse(ArtistCreate):
    id: int

    class Config:
        from_attributes = True


# ---------- Artwork ----------

class ArtworkCreate(BaseModel):
    title: str
    artist_id: int
    department: str
    classification: str
    object_date: str


class ArtworkResponse(ArtworkCreate):
    id: int

    class Config:
        from_attributes = True


# ---------- Bulk Operations ----------

class BulkArtistCreate(BaseModel):
    artists: list[ArtistCreate]


class BulkDelete(BaseModel):
    ids: list[int]


class BulkArtworkCreate(BaseModel):
    artworks: list[ArtworkCreate]


# ---------- Login ----------

class LoginRequest(BaseModel):
    username: str
    password: str
