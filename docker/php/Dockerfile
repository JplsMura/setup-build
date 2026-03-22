FROM php:8.4-fpm

# Instalação de dependências do sistema
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev

# Limpeza de cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Instalação de extensões PHP e Postgres
RUN docker-php-ext-install pdo_pgsql mbstring exif pcntl bcmath gd

# Instalação da extensão do Redis
RUN pecl install redis && docker-php-ext-enable redis

# Instalação do Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
