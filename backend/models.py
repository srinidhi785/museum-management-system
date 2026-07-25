from sqlalchemy import Column, Integer, String, ForeignKey, BigInteger
from database import Base


class Artist(Base):
    __tablename__ = "artists"

    id = Column(BigInteger, primary_key=True, index=True)
    name = Column(String)
    nationality = Column(String)
    gender = Column(String)
    birth_year = Column(Integer)
    death_year = Column(Integer)


class Artwork(Base):
    __tablename__ = "artworks"

    id = Column(BigInteger, primary_key=True, index=True)
    title = Column(String)
    artist_id = Column(BigInteger, ForeignKey("artists.id"))
    department = Column(String)
    classification = Column(String)
    object_date = Column(String)