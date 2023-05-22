#!/usr/bin/env sh

cd frontend && npm start &
cd backend && python app.py &