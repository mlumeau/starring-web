# Script pour lancer le backend FastAPI avec Poetry
# Usage : powershell -ExecutionPolicy Bypass -File run-backend.ps1

Set-Location -Path $PSScriptRoot
cd backend
poetry run uvicorn main:app --reload
