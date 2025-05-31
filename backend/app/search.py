import httpx
import os
import base64
import face_recognition
import numpy as np
from dotenv import load_dotenv
from fastapi import HTTPException, UploadFile
from PIL import Image, ImageFilter
from io import BytesIO

load_dotenv()
SERPAPI_KEY = os.getenv("SERPAPI_KEY")

# List of social media domains for filtering

SOURCE_MAPPINGS = {
    "article": "site:nytimes.com OR site:washingtonpost.com OR site:theguardian.com",
    "book": "intitle:\"book\" OR intext:\"published in\"",
    "video": "site:youtube.com OR site:vimeo.com",
    "movie": "intitle:\"movie\" OR intext:\"film\" OR intext:\"IMDb\"",
    "study": "site:researchgate.net OR site:jstor.org OR site:academia.edu",
    "social": "site:twitter.com OR site:tiktok.com OR site:instagram.com"
}

async def search_text_sources(query: str, sources: list = None):
    """Search text sources with filters"""
    # Build base query
    base_query = f'"{query}"'
    
    # Add source filters if provided
    source_filters = []
    if sources:
        for source in sources:
            if source in SOURCE_MAPPINGS:
                source_filters.append(SOURCE_MAPPINGS[source])
    
    # Combine filters
    full_query = base_query
    if source_filters:
        full_query += " (" + " OR ".join(source_filters) + ")"
    
    params = {
        "engine": "google",
        "q": full_query,
        "api_key": SERPAPI_KEY,
        "num": 15
    }

    
SOCIAL_MEDIA_DOMAINS = [
    'facebook.com', 'instagram.com', 'twitter.com', 
    'tiktok.com', 'pinterest.com', 'reddit.com'
]

async def search_text_sources(query: str):
    """Search text sources using SERPAPI"""
    url = "https://serpapi.com/search"
    params = {
        "engine": "google",
        "q": f'"{query}"',
        "api_key": SERPAPI_KEY,
        "num": 10
    }
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(url, params=params)
            resp.raise_for_status()
            data = resp.json()
            return parse_text_results(data)
        except Exception as e:
            raise HTTPException(500, f"Text search failed: {str(e)}")

async def reverse_image_search(
    file: UploadFile, 
    search_faces: bool = True, 
    search_social: bool = True
):
    """Reverse image search with optional face detection and social media filtering"""
    image_data = await file.read()
    image = Image.open(BytesIO(image_data))
    np_image = np.array(image)
    
    # Perform standard search
    standard_results = await serpapi_image_search(image_data)
    
    # Apply social media filter if requested
    if search_social:
        standard_results = filter_social_media(standard_results)
    
    results = {"standard_results": standard_results}
    
    # Face detection
    if search_faces:
        face_results = []
        face_locations = face_recognition.face_locations(np_image)
        
        for i, face_location in enumerate(face_locations):
            top, right, bottom, left = face_location
            face_image = image.crop((left, top, right, bottom))
            
            # Convert to bytes
            face_bytes = BytesIO()
            face_image.save(face_bytes, format='JPEG')
            face_bytes = face_bytes.getvalue()
            
            # Search for face
            face_search_results = await serpapi_image_search(face_bytes)
            
            # Apply social media filter if requested
            if search_social:
                face_search_results = filter_social_media(face_search_results)
            
            face_results.append({
                "face_index": i,
                "position": {"top": top, "right": right, "bottom": bottom, "left": left},
                "results": face_search_results
            })
        
        results["face_results"] = face_results
    
    return results

async def serpapi_image_search(image_bytes: bytes):
    """Perform reverse image search using SERPAPI"""
    base64_image = base64.b64encode(image_bytes).decode()
    url = "https://serpapi.com/search"
    params = {
        "engine": "google_reverse_image",
        "api_key": SERPAPI_KEY,
        "image_content": base64_image
    }
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(url, params=params, timeout=30.0)
            resp.raise_for_status()
            data = resp.json()
            return parse_image_results(data)
        except httpx.ReadTimeout:
            return {"error": "Image search timed out after 30 seconds"}
        except Exception as e:
            return {"error": f"Image search failed: {str(e)}"}

def filter_social_media(results):
    """Filter results to only include social media sources"""
    if isinstance(results, dict) and 'error' in results:
        return results
    
    filtered = []
    for result in results:
        source = result.get("source", "").lower()
        if any(domain in source for domain in SOCIAL_MEDIA_DOMAINS):
            filtered.append(result)
    return filtered or [{"error": "No social media results found"}]

def parse_text_results(data):
    """Parse text search results"""
    return [
        {
            "title": item.get("title"),
            "link": item.get("link"),
            "snippet": item.get("snippet"),
            "source": item.get("displayed_link")
        } 
        for item in data.get("organic_results", [])
    ]

def parse_image_results(data):
    """Parse reverse image search results"""
    # Handle API errors
    if "error" in data:
        return {"error": data["error"]}
    
    # Handle no results
    if not data.get("image_results"):
        return [{"error": "No image results found"}]
    
    return [
        {
            "title": item.get("title") or "Image result",
            "link": item.get("link"),
            "thumbnail": item.get("thumbnail"),
            "source": item.get("source") or item.get("displayed_link") or "Unknown source"
        }
        for item in data.get("image_results", [])[:10]
    ]


