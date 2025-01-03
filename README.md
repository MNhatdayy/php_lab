# php_lab

### Install JWT Lib php

```bash
composer require firebase/php-jwt
```

### Access path to folder project

```bash
 cd /mnt/d/ProgramFilesD/laragon/www/php_lab
```

### Check key-pair

```bash
find ~ -name "bootcampt7cn.pem"
mv /path/to/bootcampt7cn.pem ~/.ssh/
chmod 600 ~/.ssh/bootcampt7cn.pem
```

### Move project to server by SSH

```bash
 scp -i ~/.ssh/bootcampt7cn.pem -r /mnt/d/ProgramFilesD/laragon/www/php_lab ubuntu@46.137.226.90:/home/ubuntu/php_lab
```

### Build and start docker containers

```bash
sudo docker-compose up --build -d

sudo docker-compose ps

```

### Change port of Apache2 service after building compose

```bash
sudo docker exec -it php_lab-backend-1 bash

cat /etc/apache2/ports.conf

sed -i 's/Listen 80/Listen 81/' /etc/apache2/ports.conf


cat /etc/apache2/sites-enabled/000-default.conf

sed -i 's/<VirtualHost \*:80>/<VirtualHost *:81>/' /etc/apache2/sites-enabled/000-default.conf


service apache2 restart

a2enmod rewrite

service apache2 restart

```
