from fastapi import APIRouter, HTTPException, status, Body
from sqlalchemy.orm import Session
from db import SessionLocal, WatchlistItem
from entities.watchlist_item import WatchlistItemIn, WatchlistItemOut
from typing import List
from datetime import datetime

router = APIRouter()

@router.get("/watchlist", response_model=List[WatchlistItemOut])
def get_watchlist():
    db: Session = SessionLocal()
    items = db.query(WatchlistItem).order_by(WatchlistItem.added_at.desc()).all()
    db.close()
    return items

@router.post("/watchlist", response_model=WatchlistItemOut, status_code=status.HTTP_201_CREATED)
def add_to_watchlist(item: WatchlistItemIn):
    db: Session = SessionLocal()
    exists = db.query(WatchlistItem).filter_by(movie_id=item.movie_id).first()
    if exists:
        db.close()
        raise HTTPException(status_code=409, detail="Movie already in the watchlist.")
    db_item = WatchlistItem(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    db.close()
    return db_item

@router.delete("/watchlist/{movie_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_from_watchlist(movie_id: int):
    db: Session = SessionLocal()
    item = db.query(WatchlistItem).filter_by(movie_id=movie_id).first()
    if not item:
        db.close()
        raise HTTPException(status_code=404, detail="Movie not found in the watchlist.")
    db.delete(item)
    db.commit()
    db.close()
    return

@router.get("/watchlist/{movie_id}", response_model=WatchlistItemOut)
def get_watchlist_item(movie_id: int):
    db: Session = SessionLocal()
    item = db.query(WatchlistItem).filter_by(movie_id=movie_id).first()
    db.close()
    if not item:
        raise HTTPException(status_code=404, detail="Movie not found in the watchlist.")
    return item
