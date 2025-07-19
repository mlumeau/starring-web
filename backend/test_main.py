import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()

def test_movies_upcoming(monkeypatch):
    # Mock the fetch_tmdb function in the api.routes_movies module (the one used by FastAPI)
    import backend.api.routes_movies as routes_movies
    async def mock_fetch_tmdb(endpoint, params=None):
        return {"results": [{"id": 1, "title": "Fake Movie"}]}
    monkeypatch.setattr(routes_movies, "fetch_tmdb", mock_fetch_tmdb)
    response = client.get("/movies/upcoming")
    assert response.status_code == 200
    data = response.json()
    assert "results" in data
    assert data["results"][0]["title"] == "Fake Movie"
