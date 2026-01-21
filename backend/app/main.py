from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import init_db
from .routers import employees, attendance

app = FastAPI(
    title="HRMS Lite API",
    description="Human Resource Management System - Lite Version",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
@app.on_event("startup")
def on_startup():
    init_db()

# Include routers
app.include_router(employees.router)
app.include_router(attendance.router)

@app.get("/")
def root():
    return {
        "message": "Welcome to HRMS Lite API",
        "docs": "/docs",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}