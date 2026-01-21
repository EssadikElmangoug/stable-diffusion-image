# Docker Setup Instructions

## Quick Start

### Using Docker Compose (Recommended)

**Use the newer `docker compose` command (without hyphen):**

```bash
# Build and start the container
docker compose up -d --build

# View logs
docker compose logs -f

# Stop the container
docker compose down

# Restart the container
docker compose restart
```

### Using Docker directly

If you prefer using `docker` commands directly:

```bash
# Build the image
docker build -t stable-diffusion-image .

# Run with auto-restart on server reboot
docker run -d -p 4000:4000 --name stable-diffusion-app --restart unless-stopped stable-diffusion-image
```

## Fix for old docker-compose (if needed)

If you must use the old `docker-compose` command, install the missing dependency:

```bash
# On Ubuntu/Debian
sudo apt-get install python3-distutils

# Or use the newer docker compose instead (recommended)
```

## Auto-restart on server reboot

The container is configured with `restart: unless-stopped` which means:
- ✅ Automatically starts when server reboots
- ✅ Automatically restarts if container crashes
- ❌ Won't restart if you manually stop it

## Access the app

Once running, access at: **http://localhost:4000**
