# Build stage for Node dependencies and assets
FROM node:20-alpine AS frontend-builder

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci

COPY . .

RUN npm run build

# PHP application stage
FROM php:8.2-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    nginx \
    curl \
    git \
    unzip \
    libzip-dev \
    jpeg-dev \
    png-dev \
    freetype-dev \
    libjpeg-turbo-dev \
    libpng-dev \
    icu-dev \
    oniguruma-dev \
    sqlite-dev \
    mysql-client

# Install PHP extensions
RUN docker-php-ext-install \
    pdo \
    pdo_mysql \
    zip \
    intl \
    mbstring \
    bcmath \
    gd

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /app

# Copy the entire project
COPY --chown=www-data:www-data . .

# Copy built frontend assets from builder
COPY --from=frontend-builder --chown=www-data:www-data /app/public/build ./public/build

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Create necessary directories
RUN mkdir -p storage/logs storage/framework storage/framework/cache storage/framework/sessions storage/framework/views \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Copy nginx configuration
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/default.conf /etc/nginx/conf.d/default.conf

# Copy PHP-FPM configuration
COPY docker/php-fpm.conf /usr/local/etc/php-fpm.conf

# Copy supervisor configuration
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Install supervisor
RUN apk add --no-cache supervisor

# Expose port
EXPOSE 80

# Set permissions
RUN chown -R www-data:www-data /app

# Start supervisor
CMD ["/usr/sbin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
