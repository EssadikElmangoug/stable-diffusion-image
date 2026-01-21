#!/bin/bash
# Simple script to build and run the Docker container using plain docker commands

echo "Building Docker image..."
docker build -t stable-diffusion-image .

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo ""
echo "Stopping and removing existing container (if any)..."
docker stop stable-diffusion-app 2>/dev/null
docker rm stable-diffusion-app 2>/dev/null

echo ""
echo "Starting container with auto-restart..."
docker run -d \
  --name stable-diffusion-app \
  -p 4000:4000 \
  --restart unless-stopped \
  stable-diffusion-image

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Container started successfully!"
    echo "📱 Access the app at: http://localhost:4000"
    echo ""
    echo "Useful commands:"
    echo "  View logs:    docker logs -f stable-diffusion-app"
    echo "  Stop:         docker stop stable-diffusion-app"
    echo "  Start:        docker start stable-diffusion-app"
    echo "  Restart:      docker restart stable-diffusion-app"
    echo "  Remove:       docker rm -f stable-diffusion-app"
else
    echo ""
    echo "❌ Failed to start container"
    exit 1
fi
