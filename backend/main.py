from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
import models

from auth import router as auth_router
from artists import router as artists_router
from artworks import router as artworks_router
from dashboard import router as dashboard_router

Base.metadata.create_all(bind=engine)

app = FastAPI()

# Allow React frontend to access FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(artists_router)
app.include_router(artworks_router)
app.include_router(dashboard_router)


@app.get("/")
def home():
    return {"message": "Museum API Running"}