from fastapi import APIRouter, Query, Depends, HTTPException
from core.services import fetch_tmdb
from db import SessionLocal, WatchlistItem
from sqlalchemy.orm import Session

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/upcoming")
async def get_upcoming_movies(page: int = Query(1, ge=1), page_size: int = Query(20, ge=1, le=100)):
    return await fetch_tmdb("/movie/upcoming", params={"page": page})

@router.get("/now_playing")
async def get_now_playing_movies(page: int = Query(1, ge=1), page_size: int = Query(20, ge=1, le=100)):
    return await fetch_tmdb("/movie/now_playing", params={"page": page})

@router.get("/top_rated")
async def get_top_rated_movies(page: int = Query(1, ge=1), page_size: int = Query(20, ge=1, le=100)):
    return await fetch_tmdb("/movie/top_rated", params={"page": page})

@router.get("/popular")
async def get_popular_movies(page: int = Query(1, ge=1), page_size: int = Query(20, ge=1, le=100)):
    return await fetch_tmdb("/movie/popular", params={"page": page})

@router.get("/detail/{movie_id}")
async def get_movie_detail(movie_id: int, db: Session = Depends(get_db)):
    # Main detail
    movie = await fetch_tmdb(f"/movie/{movie_id}")
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    # Backdrop
    backdrop_path = movie.get("backdrop_path")
    # Actors (casting)
    credits = await fetch_tmdb(f"/movie/{movie_id}/credits")
    cast = credits.get("cast", [])[:10]  # Top 10 actors
    # Watchlist status
    in_watchlist = db.query(WatchlistItem).filter_by(movie_id=movie_id).first() is not None
    return {
        **movie,
        "backdrop_path": backdrop_path,
        "cast": [{"id": a["id"], "name": a["name"], "character": a.get("character"), "profile_path": a.get("profile_path")} for a in cast],
        "in_watchlist": in_watchlist
    }
