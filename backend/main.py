from fastapi import FastAPI
from api.routes_movies import router as movies_router
from api.routes_watchlist import router as watchlist_router

app = FastAPI()

app.include_router(movies_router, prefix="/movies", tags=["movies"])
app.include_router(watchlist_router, tags=["watchlist"])

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI backend!"}
