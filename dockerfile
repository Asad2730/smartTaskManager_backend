# Dockerfile
FROM oven/bun:latest-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Production image, copy all the files and run the application
FROM base AS runner
WORKDIR /app

# Create a non-root user
RUN addgroup --system --gid 1001 bun && \
    adduser --system --uid 1001 bun && \
    mkdir -p /app/logs && \
    chown -R bun:bun /app

# Switch to non-root user
USER bun

# Copy package.json and node_modules
COPY --from=builder --chown=bun:bun /app/node_modules ./node_modules
COPY --from=builder --chown=bun:bun /app/package.json ./
COPY --from=builder --chown=bun:bun /app/bun.lockb ./

# Copy source code
COPY --from=builder --chown=bun:bun /app/src ./src
COPY --from=builder --chown=bun:bun /app/config ./config
COPY --from=builder --chown=bun:bun /app/models ./models
COPY --from=builder --chown=bun:bun /app/routes ./routes
COPY --from=builder --chown=bun:bun /app/controllers ./controllers
COPY --from=builder --chown=bun:bun /app/services ./services
COPY --from=builder --chown=bun:bun /app/middlewares ./middlewares
COPY --from=builder --chown=bun:bun /app/utils ./utils
COPY --from=builder --chown=bun:bun /app/validators ./validators
COPY --from=builder --chown=bun:bun /app/index.ts ./
COPY --from=builder --chown=bun:bun /app/tsconfig.json ./

# Expose the port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:4000/api/health || exit 1

# Run the application
CMD ["bun", "run", "index.ts"]