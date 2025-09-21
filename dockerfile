FROM oven/bun:1.1.5-alpine

WORKDIR /app

# Copy package files first
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy ALL source files
COPY . .

# Create logs directory
RUN mkdir -p /app/logs

# Expose the port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:4000/api/health || exit 1

# Run the application - index.ts is in src/ directory
CMD ["bun", "run", "src/index.ts"]