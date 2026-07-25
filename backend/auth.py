from fastapi import APIRouter, HTTPException
from schemas import LoginRequest

router = APIRouter()

USERNAME = "admin"
PASSWORD = "Museum@2026!"

@router.post("/login")
def login(data: LoginRequest):
    print(f"Username received: '{data.username}'")
    print(f"Password received: '{data.password}'")

    if data.username == USERNAME and data.password == PASSWORD:
        return {"message": "Login Successful"}

    raise HTTPException(
        status_code=401,
        detail="Invalid username or password"
    )