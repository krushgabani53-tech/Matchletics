#!/bin/bash
echo "Starting Sports Squad Frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi
echo "Starting Vite dev server..."
npm run dev
