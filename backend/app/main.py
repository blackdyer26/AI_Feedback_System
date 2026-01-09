from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import reviews
from app.database.connection import engine, Base
import os
from dotenv import load_dotenv

load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Fynd AI Feedback System API",
    description="Production-ready API for AI-powered feedback management",
    version="1.0.0"
)

# CORS configuration
origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(reviews.router)

@app.get("/")
async def root():
    return {
        "message": "Fynd AI Feedback System API",
        "version": "1.0.0",
        "docs": "/docs"
    }