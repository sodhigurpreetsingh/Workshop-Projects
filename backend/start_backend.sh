#!/bin/bash
# Start the backend server for SVIET Workshop
# Usage: ./start_backend.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Stop any existing backend server on port 8000
echo "Checking for existing backend server..."
if lsof -ti:8000 > /dev/null 2>&1; then
    echo "Stopping existing server on port 8000..."
    pkill -f "uvicorn app.main:app" || true
    sleep 2
    echo "✓ Existing server stopped"
else
    echo "✓ Port 8000 is free"
fi

# Activate virtual environment
if [ -d ".venv" ]; then
    source .venv/bin/activate
elif [ -d "../.venv" ]; then
    source ../.venv/bin/activate
else
    echo "Error: No .venv found in backend/ or project root."
    echo "Create one with: python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt"
    exit 1
fi

# Install/update dependencies
pip install -r requirements.txt --quiet

# Start the server
echo "Starting SVIET Workshop backend on http://127.0.0.1:8000"
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
