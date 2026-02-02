#!/bin/bash

# Script to build and serve the frontend application

echo "Building the frontend application..."

cd /root/clawd/blockchain-game

# Install any missing frontend dependencies
npm install

# Build the application
npm run build

if [ $? -eq 0 ]; then
    echo "Build successful!"

    # Check if webpack-dev-server is available for serving
    if npx webpack serve --mode development --port 8080 --host 0.0.0.0; then
        echo "Frontend application is now served at http://localhost:8080"
    else
        # Fallback: use a simple HTTP server if webpack serve fails
        echo "Using fallback HTTP server..."
        
        # Create dist directory if it doesn't exist
        mkdir -p dist
        
        # Copy built files to dist if they exist, otherwise copy src
        if [ -d "dist" ]; then
            cp -r src/* dist/ 2>/dev/null || echo "No dist directory found, copying from src"
        else
            mkdir -p dist
            cp -r src/* dist/ 2>/dev/null || echo "Copying files from src to dist"
        fi
        
        # Try Python's built-in server
        if command -v python3 &> /dev/null; then
            cd dist
            echo "Serving frontend application at http://localhost:8080"
            python3 -m http.server 8080
        elif command -v python &> /dev/null; then
            cd dist
            echo "Serving frontend application at http://localhost:8080"
            python -m http.server 8080
        else
            echo "No suitable server found. Built files are in the dist directory."
        fi
    fi
else
    echo "Build failed!"
    exit 1
fi