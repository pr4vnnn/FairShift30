# Multi-stage Dockerfile for Google Cloud Run Deployment
# FairShift 360 - Production Build

# Stage 1: Build client assets
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./
RUN npm ci

# Copy application source
COPY . .

# Build production assets
RUN npm run build

# Stage 2: Production runtime environment
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
# Google Cloud Run default port
ENV PORT=8080

COPY package*.json ./
RUN npm ci --omit=dev && npm install -g tsx

# Copy built frontend assets and server entrypoint
COPY --from=builder /app/dist ./dist
COPY server.ts ./
COPY tsconfig.json ./

EXPOSE 8080

# Run lightweight production web server
CMD ["tsx", "server.ts"]
