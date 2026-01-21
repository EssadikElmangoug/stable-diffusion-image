#!/bin/bash
# Script to fix the old docker-compose or use the newer docker compose

echo "Checking Docker Compose availability..."

# Check if new docker compose is available
if docker compose version > /dev/null 2>&1; then
    echo "✅ Found 'docker compose' (newer version)"
    echo "Using: docker compose"
    docker compose up -d --build
elif command -v docker-compose > /dev/null 2>&1; then
    echo "⚠️  Found old 'docker-compose', attempting to fix..."
    
    # Try to install distutils
    if command -v apt-get > /dev/null 2>&1; then
        echo "Installing python3-distutils..."
        sudo apt-get update && sudo apt-get install -y python3-distutils
    elif command -v yum > /dev/null 2>&1; then
        echo "Installing python3-distutils..."
        sudo yum install -y python3-distutils
    else
        echo "❌ Cannot auto-install distutils. Please install manually or use 'docker compose'"
        exit 1
    fi
    
    echo "Trying docker-compose again..."
    docker-compose up -d --build
else
    echo "❌ Neither 'docker compose' nor 'docker-compose' found"
    echo "Please install Docker Compose"
    exit 1
fi
