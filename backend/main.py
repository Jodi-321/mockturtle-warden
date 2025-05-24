'''
FastAPI application entry point

This module initializes the FastAPI app, loads configuration, registers API routes,
and sets up middleware like CORS. Future enhancements may include database connection setup,
JWT middleware, and lifecycle hooks
'''

print(">>> RUNNING backend.main.py")

import os 
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv


# Load environment variables from .env file
load_dotenv()

# Import route modules
from routes import chat
from routes import auth

# Import custom middleware
from middleware.ip_whitelist import IPWhitelistMiddleware

# Initialize FastAPI app
app = FastAPI(
    title="AI Security Chat",
    description="Secure chat API for MVP prototype",
    version="0.1.0"
)

# Setup CORS (Cross-Origin Resource Sharing)
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Frontend origin(s)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Whitelist Middleware
# ALLOWED_IPS is comma-separated: "127.0.0.1,172.20.0.1""
allowed_ips = os.getenv("ALLOWED_IPS", "127.0.0.1").split(",")

# EXCLUDED_IPS is comma-seperated: 

from middleware.ip_whitelist import IPWhitelistMiddleware

# Register IP Whitelist Middleware
app.add_middleware(
    IPWhitelistMiddleware,
    allowed_ips=allowed_ips,
    excluded_paths=""
    )

# Register route modules
app.include_router(chat.router)
app.include_router(auth.router)

# Health Check endpoint
@app.get("/health")
def health_check():
    return {"status":"ok"}

