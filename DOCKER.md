# Docker Setup Guide

This project is now configured to run with Docker. Follow these instructions to get started.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (usually included with Docker Desktop)

## Quick Start

### 1. Build and Start Containers

```bash
docker-compose up -d --build
```

This will:
- Build the PHP/Laravel application container
- Start MySQL database container
- Start Redis cache container
- Start phpMyAdmin for database management

### 2. Generate Application Key

```bash
docker-compose exec app php artisan key:generate
```

### 3. Run Database Migrations

```bash
docker-compose exec app php artisan migrate
```

### 4. Seed Database (Optional)

```bash
docker-compose exec app php artisan db:seed
```

### 5. Build Frontend Assets

```bash
docker-compose exec app npm run build
```

## Accessing the Application

- **Laravel Application**: http://localhost
- **phpMyAdmin**: http://localhost:8080
  - Username: `app_user`
  - Password: `app_password`

## Common Commands

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f mysql
docker-compose logs -f redis
```

### Run Artisan Commands

```bash
docker-compose exec app php artisan [command]
```

### Run NPM Commands

```bash
docker-compose exec app npm run dev    # Development mode
docker-compose exec app npm run build  # Production build
```

### Access Application Shell

```bash
docker-compose exec app bash
```

### Stop Containers

```bash
docker-compose down
```

### Stop and Remove Volumes

```bash
docker-compose down -v
```

## Environment Configuration

- Development: Uses `.env.docker` for Docker-specific settings
- The `docker-compose.yml` loads environment variables from `.env` file
- Update credentials in `docker-compose.yml` or create `.env` with custom values:

```bash
cp .env.docker .env
```

## Services

### app
- **Image**: Built from Dockerfile
- **Port**: 80 (HTTP), 443 (HTTPS - optional)
- **Services**: PHP-FPM, Nginx, Laravel
- **Mount**: Full project directory for live editing

### mysql
- **Image**: mysql:8.0
- **Port**: 3306
- **Database**: app_db
- **User**: app_user
- **Password**: app_password

### redis
- **Image**: redis:7-alpine
- **Port**: 6379
- **Used for**: Caching, sessions, and queues

### phpmyadmin
- **Image**: phpmyadmin:latest
- **Port**: 8080
- **For**: Database management UI

## Performance Optimization

### For M1/M2 Mac:
The configuration automatically selects optimized images for your platform.

### For Windows (WSL2):
- Ensure WSL2 is properly configured
- Performance can be improved by placing the project in WSL filesystem rather than Windows

### Production Considerations:
- Set `APP_DEBUG=false` in environment
- Use strong database passwords
- Configure proper SSL certificates
- Set up proper logging and monitoring
- Use Docker Swarm or Kubernetes for orchestration

## Troubleshooting

### "Port already in use" error
```bash
# Change ports in docker-compose.yml or free up ports:
sudo lsof -i :80   # Check port 80
sudo lsof -i :3306 # Check port 3306
```

### Database connection errors
```bash
docker-compose logs mysql  # Check MySQL logs
docker-compose exec mysql mysql -u app_user -p  # Connect to MySQL
```

### Permission errors on storage/logs
```bash
docker-compose exec app chown -R www-data:www-data storage bootstrap/cache
```

### Clear cache and rebuild
```bash
docker-compose exec app php artisan cache:clear
docker-compose exec app php artisan config:clear
docker-compose exec app php artisan view:clear
```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Laravel Documentation](https://laravel.com/docs)
- [Inertia.js Documentation](https://inertiajs.com/)

## Notes

- The Dockerfile uses multi-stage build to optimize image size
- Supervisor manages PHP-FPM and Nginx processes
- The application uses Redis for caching and sessions
- Frontend assets are built during Docker image build (production-ready)
- Development changes to PHP code are reflected immediately due to volume mounting
- For JS/CSS changes, rebuild assets with `npm run build` or use `npm run dev`
