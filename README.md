# smarttaskmanager_backend

# Clone repository
git clone https://github.com/Asad2730/smartTaskManager_backend
cd smartTaskManager_backend


Create .env file

# Install dependencies
bun install

# Install AI server dependencies
cd mcp-server
bun  install
cd ..

# Start main backend
bun run dev

# Start AI server (in separate terminal)
cd mcp-server
npm run dev

# Start all services (if not running)
docker-compose up -d --build

# Stop all services
docker-compose down

# Stop and remove volumes (complete cleanup)
docker-compose down -v

# View logs
docker-compose logs -f app



# Access URLs:
   Main API: http://localhost:4000

  AI Server: http://localhost:8080

  MongoDB GUI: http://localhost:8081 (admin/pass)

  MongoDB Direct: localhost:27017


# Run all tests
bun test

# Run tests with watch mode
bun test --watch



```

This project was created using `bun init` in bun v1.2.22. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
