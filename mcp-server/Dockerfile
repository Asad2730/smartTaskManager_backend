# mcp-server/Dockerfile
FROM oven/bun:1.1.5-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN bun install

# Copy source code
COPY src/ ./src/
COPY tsconfig.json ./

# Expose port
EXPOSE 8080

# Start the server directly with Bun
CMD ["bun", "run", "src/index.ts"]