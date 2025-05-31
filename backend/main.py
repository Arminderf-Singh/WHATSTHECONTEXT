from fastapi import FastAPI
from app.api import app
from fastapi.middleware.cors import CORSMiddleware
from app.api import router


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)



app = FastAPI(
    title="WhatsTheContext",
    description="Reverse search for text and images",
    version="1.0.0"
)

app.include_router(router, prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "active"}