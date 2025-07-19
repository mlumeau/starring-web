import os
from typing import Optional
from datetime import datetime, timedelta
import json
import httpx
from fastapi import HTTPException
from sqlalchemy.orm import Session
from db import SessionLocal, MovieCache

def get_tmdb_api_key():
    return os.getenv("TMDB_API_KEY", "")

TMDB_BASE_URL = "https://api.themoviedb.org/3"
CACHE_DURATION_MINUTES = 30

async def fetch_tmdb(endpoint: str, params: Optional[dict] = None):
    db: Session = SessionLocal()
    # For movie details, force params to {} for a unique cache key
    is_detail = endpoint.startswith("/movie/") and endpoint.count("/") == 2 and endpoint.split("/")[-1].isdigit()
    if is_detail and not params:
        params = {}
    params_str = json.dumps(params, sort_keys=True) if params else ""
    cache = db.query(MovieCache).filter_by(endpoint=endpoint, params=params_str).first()
    now = datetime.utcnow()
    if cache and (now - cache.created_at) < timedelta(minutes=CACHE_DURATION_MINUTES):
        if is_detail:
            print(f"[CACHE] Movie detail used for {endpoint} (id={endpoint.split('/')[-1]})")
        else:
            print(f"[CACHE] Response used for {endpoint} with params={params_str}")
        db.close()
        return json.loads(cache.response)
    result = await fetch_tmdb_from_api(endpoint, params)
    # Save to cache
    new_cache = MovieCache(endpoint=endpoint, params=params_str, response=json.dumps(result), created_at=now)
    db.merge(new_cache)
    db.commit()
    db.close()
    return result

async def fetch_tmdb_from_api(endpoint: str, params: Optional[dict] = None):
    api_key = get_tmdb_api_key()
    if not api_key:
        raise HTTPException(status_code=500, detail="TMDB_API_KEY not configured.")
    url = f"{TMDB_BASE_URL}{endpoint}"
    # Add the API key as a GET parameter
    if params is None:
        params = {}
    params["api_key"] = api_key
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        return response.json()
