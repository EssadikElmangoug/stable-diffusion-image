# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install vite globally for preview server
RUN npm install -g vite@^6.2.0

# Copy built files and config from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/vite.config.ts ./vite.config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Expose port 4000
EXPOSE 4000

# Run vite preview on port 4000
CMD ["vite", "preview", "--host", "0.0.0.0", "--port", "4000"]
