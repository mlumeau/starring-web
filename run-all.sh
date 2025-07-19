#!/bin/bash
# Script to launch backend (FastAPI/Poetry) and frontend (Vite/React) in parallel
# Usage: bash run-all.sh

# Launch backend
(cd backend && poetry run uvicorn main:app --reload) &

# Launch frontend (src folder)
(cd src && npm run dev) &

wait
