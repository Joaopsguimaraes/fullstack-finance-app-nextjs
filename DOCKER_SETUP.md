# Docker Setup for Finance App

This document explains how to use the Docker Compose setup for the PostgreSQL database.

## Prerequisites

- Docker and Docker Compose installed on your system
- Node.js and npm/yarn for the application

## Quick Start

1. **Start the PostgreSQL container:**
   ```bash
   docker-compose up -d
   ```

2. **Check if the container is running:**
   ```bash
   docker-compose ps
   ```

3. **View container logs:**
   ```bash
   docker-compose logs postgres
   ```

## Database Connection

The PostgreSQL container is configured with:
- **Host:** localhost
- **Port:** 5432
- **Database:** finance_app
- **Username:** postgres
- **Password:** postgres
- **Schema:** public

## Environment Variables

The `.env` file contains:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/finance_app?schema=public"
NODE_ENV=development
```

## Prisma Commands

After starting the container, you can run Prisma commands:

1. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

2. **Run database migrations:**
   ```bash
   npx prisma migrate dev
   ```

3. **Open Prisma Studio:**
   ```bash
   npx prisma studio
   ```

## Stopping the Container

To stop the PostgreSQL container:
```bash
docker-compose down
```

To stop and remove all data:
```bash
docker-compose down -v
```

## Troubleshooting

- **Port already in use:** Make sure port 5432 is not used by another PostgreSQL instance
- **Permission denied:** Ensure Docker has proper permissions to create volumes
- **Container won't start:** Check Docker logs for specific error messages

## Data Persistence

The database data is persisted in a Docker volume named `postgres_data`. This ensures your data survives container restarts.
