from fastapi import FastAPI, APIRouter, UploadFile, File, Form
from pydantic import BaseModel
from .search import search_text_sources, reverse_image_search  # Relative import
from fastapi.middleware.cors import CORSMiddleware

router = APIRouter()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

router = APIRouter()
class TextQuery(BaseModel):
    text: str

@router.post("/search/text")
async def search_text(query: TextQuery):
    results = await search_text_sources(query.text)
    return {"results": results}

@router.post("/search/image")
async def search_image(
    file: UploadFile = File(...),
    search_faces: bool = Form(True),
    search_social: bool = Form(True)
):
    return await reverse_image_search(
        file, 
        search_faces=search_faces, 
        search_social=search_social
    )


class TextQuery(BaseModel):
    text: str

@router.post("/search/text")
async def search_text(query: TextQuery):
    results = await search_text_sources(query.text)
    return {"results": results}

@router.post("/search/image")
async def search_image(
    file: UploadFile = File(...),
    search_faces: bool = Form(True),
    search_social: bool = Form(True)
):
    return await reverse_image_search(
        file, 
        search_faces=search_faces, 
        search_social=search_social
    )

app.include_router(router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "WhatsTheContext API is running"}