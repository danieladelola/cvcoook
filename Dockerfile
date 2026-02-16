# Multi-stage build for optimal image size
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Install bun
RUN npm install -g bun

# Copy package files
COPY package*.json ./
COPY bun.lockb ./

# Install dependencies (including dev for build tools)
RUN bun install

# Copy source code
COPY . .

# Build frontend
RUN npm run build

# Final stage
FROM node:22-alpine

WORKDIR /app

# Install dumb-init to handle signals properly
RUN apk add --no-cache dumb-init

# Copy package files
COPY package*.json ./
COPY bun.lockb ./

# Install bun
RUN npm install -g bun

# Install production dependencies only (allow fallback if lockfile is frozen)
# If `bun install --production` fails due to a frozen lockfile, fall back to
# a full `bun install` so the container can still be built in CI/CD.
RUN bun install --production || bun install

# Install tsx for TypeScript runtime support
RUN bun install -g tsx@latest || npm install -g tsx@latest

# Ensure bun's global bin is on PATH so tsx is discoverable when installed by bun
ENV PATH=/root/.bun/bin:${PATH}

# Copy prisma schema and migrations
COPY prisma ./prisma

# Copy built application files
COPY --from=builder /app/dist ./dist
COPY server ./server

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Set environment
ENV NODE_ENV=production

# Use dumb-init to properly handle signals
ENTRYPOINT ["dumb-init", "--"]

# Start the application with tsx
CMD ["tsx", "server/index.ts"]
