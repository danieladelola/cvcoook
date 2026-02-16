# Coolify Deployment Guide

This project is configured for deployment on Coolify. Follow these steps to deploy your application.

## Prerequisites

- A Coolify instance running
- Docker installed (if testing locally)
- PostgreSQL database (can be managed by Coolify or external)

## Environment Variables

The following environment variables must be set in your Coolify deployment:

```
DATABASE_URL=postgres://user:password@host:port/database
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
PORT=3000
NODE_ENV=production
```

See `.env.example` for a template.

## Deployment Steps

### 1. Via Coolify Dashboard

1. Connect your Git repository to Coolify
2. Create a new application from this repository
3. Set the Dockerfile path to `./Dockerfile`
4. Configure the following settings:
   - **Build Command**: Leave empty (Dockerfile handles it)
   - **Start Command**: Leave empty (Dockerfile ENTRYPOINT/CMD handles it)
   - **Port**: 3000
   - **Base Directory**: /

5. Add environment variables:
   - Create a PostgreSQL database through Coolify or connect an external one
   - Set `DATABASE_URL` to your database connection string
   - Set `JWT_SECRET` to a strong random string
   - Keep `JWT_EXPIRE=7d` and `NODE_ENV=production`

6. Deploy

### 2. Via Docker Compose (Local Testing)

```bash
# Copy environment template
cp .env.example .env

# Update .env with your settings
nano .env

# Run with docker-compose
docker-compose up -d

# Run Prisma migrations
docker exec vuracv_app npm run prisma:migrate
```

### 3. Via Docker (Manual)

```bash
# Build the image
docker build -t vuracv:latest .

# Run the container
docker run -d \
  --name vuracv \
  -p 3000:3000 \
  -e DATABASE_URL="postgres://user:pass@host/db" \
  -e JWT_SECRET="your-secret" \
  -e NODE_ENV=production \
  vuracv:latest
```

## Database Setup

The application uses Prisma for database management. Migrations are applied automatically on startup if needed.

### Manual Migration (if needed)

```bash
# Inside the running container
docker exec vuracv npm run prisma:migrate

# Or via npm in development
npm run prisma:migrate
```

### Database Schema

The schema is defined in `prisma/schema.prisma`. Key tables include:
- `User`: User accounts with authentication
- `PasswordReset`: Password reset tokens

## Application Structure

```
├── src/                 # React frontend (Vite)
├── server/             # Express backend (TypeScript)
├── prisma/            # Database schema and migrations
├── dist/              # Built frontend (generated on build)
├── Dockerfile         # Production Docker image
├── docker-compose.yml # Local development setup
└── .env.example       # Environment variable template
```

## Features

- **Frontend**: React with TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based authentication
- **API Routes**:
  - `POST /api/auth/register` - User registration
  - `POST /api/auth/login` - User login
  - `GET /api/auth/me` - Get current user (requires token)
  - `POST /api/auth/forgot-password` - Request password reset
  - `POST /api/auth/reset-password` - Reset password
  - `GET /api/health` - Health check

## Default Admin Account

A default admin user is created automatically on first startup:
- **Email**: admin@vura.pro
- **Password**: 12345678

⚠️ **Important**: Change this password immediately in production!

## Health Checks

The application includes a health check endpoint at `/api/health`. This is used by Docker/Coolify to verify the application is running.

## Logs

Monitor application logs in Coolify dashboard or via:

```bash
docker logs vuracv
```

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Ensure PostgreSQL is running and accessible
- Check network connectivity if using external database

### Port Already in Use
- Docker will assign a random port if 3000 is taken
- Check Coolify deployment details for the actual port

### Build Failures
- Clear Docker build cache: `docker system prune`
- Check Node.js version in Dockerfile matches requirements
- Verify all environment variables are set

## Support

For issues or questions, check:
1. Application logs in Coolify
2. Container logs: `docker logs vuracv`
3. This deployment guide

## Production Checklist

- [ ] Use a strong `JWT_SECRET` (not the default)
- [ ] Change default admin password
- [ ] Set up proper PostgreSQL backups
- [ ] Configure environment variables securely
- [ ] Test all authentication flows
- [ ] Monitor application logs
- [ ] Set up error tracking/logging service
- [ ] Enable HTTPS at reverse proxy/load balancer level
