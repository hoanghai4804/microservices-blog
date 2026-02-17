from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers import posts

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Blog API",
    description="Microservices Blog Platform API",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:80"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(posts.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Blog API is running!"}

@app.get("/health")
def health():
    return {"status": "healthy"}