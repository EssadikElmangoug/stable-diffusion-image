#!/bin/bash
# Script to stop and remove the Docker container

echo "Stopping container..."
docker stop stable-diffusion-app 2>/dev/null

echo "Removing container..."
docker rm stable-diffusion-app 2>/dev/null

echo "✅ Container stopped and removed"
