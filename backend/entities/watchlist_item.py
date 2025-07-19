from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class WatchlistItemIn(BaseModel):
    movie_id: int
    title: str
    original_title: Optional[str] = None
    poster_path: Optional[str] = None
    overview: Optional[str] = None

class WatchlistItemOut(WatchlistItemIn):
    id: int
    added_at: datetime
