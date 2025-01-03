 # Use an official PHP image with Apache
FROM php:8.2-apache

# Set working directory
WORKDIR /var/www/html

# Copy project files into the container
COPY . /var/www/html

# Install required PHP extensions
RUN docker-php-ext-install pdo pdo_mysql

# Install Composer and project dependencies
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install

# Expose the port Apache listens on
EXPOSE 81

# Start Apache
CMD ["apache2-foreground"]
