from typing import Optional
from pydantic import BaseModel

class Movie(BaseModel):
    id: int
    title: Optional[str] = None
    original_title: Optional[str] = None
    poster_path: Optional[str] = None
    overview: Optional[str] = None
    release_date: Optional[str] = None
    vote_average: Optional[float] = None
    vote_count: Optional[int] = None
    genres: Optional[list] = None

    class Config:
        orm_mode = True
