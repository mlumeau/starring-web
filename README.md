# Starring - Fullstack themoviedatabase.org

A fullstack web application for managing and exploring movies using themoviedatabase.org API. The backend is built with Python (FastAPI, SQLAlchemy, Alembic) and the frontend with React (Vite, TypeScript). Includes local caching, watchlist management, and modern development best practices.

## Backend (Python/FastAPI)
- FastAPI, SQLAlchemy, Alembic, Pydantic
- Tests: pytest, httpx
- Lint: ruff/flake8, formatting: black
- Dependency management: Poetry
- Database: SQLite (`movies_cache.db`)
- Start manually:
  ```sh
  cd backend
  C:/Python313/python.exe -m uvicorn main:app --reload
  ```

## Frontend (React/Vite/TypeScript)
- Initialized with Vite
- Tests: Vitest, React Testing Library
- Lint: ESLint (see `eslint.config.js`)
- Start manually:
  ```sh
  npm run dev
  ```
- Or use the provided script (Windows):
  ```powershell
  ./run-all.ps1
  ```
- Or use the provided script (Linux/Mac):
  ```sh
  ./run-all.sh
  ```

## Structure
- `.github/copilot-instructions.md`: Copilot instructions
- `backend/`: backend code
- `src/`: frontend code
- `run-all.ps1`: script to start both backend & frontend on Windows
- `run-all.sh`: script to start both backend & frontend on Linux/Mac

## To do
- Add CI/CD configuration (GitHub Actions), tests, lint, advanced state management on the frontend (e.g., Zustand, Redux Toolkit), documentation, Docker support, production build scripts, and deployment instructions.
