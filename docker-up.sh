#!/bin/bash
# Helper script to build and run the Docker container
# Uses the newer 'docker compose' command instead of 'docker-compose'

echo "Building and starting Stable Diffusion Image app..."
docker compose up -d --build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Container started successfully!"
    echo "📱 Access the app at: http://localhost:4000"
    echo ""
    echo "Useful commands:"
    echo "  View logs:    docker compose logs -f"
    echo "  Stop:         docker compose down"
    echo "  Restart:      docker compose restart"
else
    echo ""
    echo "❌ Failed to start container"
    echo "Make sure Docker is installed and running"
    exit 1
fi
