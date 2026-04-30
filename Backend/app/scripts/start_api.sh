#!/bin/bash

echo "Starting FastAPI server..."

exec gunicorn app.main:app \
    -k uvicorn.workers.UvicornWorker \
    --bind 0.0.0.0:${PORT:-10000} \
    --workers 2 \
    --worker-connections 1000 \
    --timeout 300 \
    --keep-alive 30 \
    --log-level info