# PowerShell script to launch backend (FastAPI/Poetry) and frontend (Vite/React) in parallel
# Usage: powershell -ExecutionPolicy Bypass -File run-all.ps1

$ErrorActionPreference = 'Stop'

# Launch backend
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd backend; poetry run uvicorn main:app --reload' -WindowStyle Normal

# Launch frontend (src folder)
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd src; npm run dev' -WindowStyle Normal
