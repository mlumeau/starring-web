from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime

DATABASE_URL = "sqlite:///./movies_cache.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class MovieCache(Base):
    __tablename__ = "movie_cache"
    id = Column(Integer, primary_key=True, index=True)
    endpoint = Column(String, index=True)
    params = Column(String, index=True, default="")
    response = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class WatchlistItem(Base):
    __tablename__ = "watchlist"
    id = Column(Integer, primary_key=True, index=True)
    movie_id = Column(Integer, index=True, nullable=False)
    title = Column(String, nullable=False)
    original_title = Column(String)
    poster_path = Column(String)
    overview = Column(Text)
    added_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)
