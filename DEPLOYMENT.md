# MOODFLIX - Production Deployment Checklist

## Pre-Deployment Checklist

### Code Quality

-   [ ] All tests passing: `php artisan test`
-   [ ] No console errors in browser
-   [ ] No PHP warnings/notices
-   [ ] Code formatting verified
-   [ ] All dependencies updated: `composer update`, `npm update`

### Security

-   [ ] `APP_DEBUG=false` in `.env.production`
-   [ ] `APP_KEY` generated: `php artisan key:generate`
-   [ ] CSRF protection enabled (default)
-   [ ] Headers security configured
-   [ ] HTTPS only (force redirect)
-   [ ] TMDB API credentials secured (not in git)
-   [ ] Database credentials never committed

### Performance

-   [ ] Frontend built: `npm run build`
-   [ ] Caching enabled: `CACHE_DRIVER=database`
-   [ ] Database indexes verified
-   [ ] Lazy loading implemented
-   [ ] Image optimization done
-   [ ] Minification enabled

### Database

-   [ ] Backup created before migration
-   [ ] All migrations tested
-   [ ] Rollback procedure documented
-   [ ] Database user has limited permissions
-   [ ] Query performance reviewed

### Configuration

-   [ ] `.env.production` configured
-   [ ] Database connection verified
-   [ ] Mail configuration set (if needed)
-   [ ] File permissions correct
-   [ ] Log directory writable
-   [ ] Storage directory writable

---

## Deployment Steps

### 1. Prepare Server

```bash
# SSH into production server
ssh user@production.example.com

# Navigate to web root
cd /var/www/moodflix

# Clone repository
git clone <repository-url> .

# Create .env from example
cp .env.example .env.production
```

### 2. Install Dependencies

```bash
# Install PHP dependencies
composer install --no-dev --optimize-autoloader

# Install Node dependencies
npm install --production

# Build frontend assets
npm run build
```

### 3. Configure Application

```bash
# Edit production environment
nano .env.production

# Key configurations:
# APP_ENV=production
# APP_DEBUG=false
# DB_HOST=<production-db-host>
# DB_DATABASE=<production-db-name>
# DB_USERNAME=<production-db-user>
# DB_PASSWORD=<production-db-pass>
# CACHE_DRIVER=database
```

### 4. Setup Database

```bash
# Run migrations
php artisan migrate --force --env=production

# Verify database
mysql -u <user> -p <database> -e "SHOW TABLES;"
```

### 5. Application Setup

```bash
# Generate application key (already done, but verify)
php artisan key:generate --force --env=production

# Cache configuration
php artisan config:cache --env=production

# Cache routes
php artisan route:cache --env=production

# Cache views (optional)
php artisan view:cache --env=production

# Verify permissions
chmod -R 755 storage
chmod -R 755 bootstrap/cache
```

### 6. Web Server Configuration

**Nginx Configuration:**

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name moodflix.example.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    server_name moodflix.example.com;
    root /var/www/moodflix/public;

    # SSL Configuration
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Logging
    access_log /var/log/nginx/moodflix_access.log;
    error_log /var/log/nginx/moodflix_error.log;

    # Index
    index index.php index.html;

    # Routing
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # PHP Processing
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Static Files
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Deny Access
    location ~ /\. {
        deny all;
    }
}
```

**Apache Configuration (.htaccess):**

```apache
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews
    </IfModule>

    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} -d [OR]
    RewriteCond %{REQUEST_FILENAME} -f
    RewriteRule ^ ^ [L]
    RewriteRule ^ index.php [L]
</IfModule>
```

### 7. SSL/HTTPS Setup

```bash
# Using Let's Encrypt with Certbot
sudo certbot certonly --webroot -w /var/www/moodflix/public -d moodflix.example.com

# Auto-renew
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### 8. Environment Variables

```bash
# Set secure permissions
chmod 600 .env.production

# Verify variables
php artisan config:show
```

### 9. Monitoring Setup

```bash
# Enable error logging
php artisan log:channel-test

# Set up log rotation
# Edit /etc/logrotate.d/moodflix:
/var/www/moodflix/storage/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
}
```

### 10. Final Tests

```bash
# Test application
curl -I https://moodflix.example.com

# Check API endpoints
curl -I https://moodflix.example.com/api/movies/genres

# Monitor logs
tail -f storage/logs/laravel.log
```

---

## Post-Deployment

### Health Checks

```bash
# PHP Info
php -v

# Laravel Version
php artisan --version

# Database Connection
php artisan tinker
>>> DB::connection()->getPDO();

# Cache Status
php artisan cache:status
```

### Performance Monitoring

**Enable Monitoring:**

```bash
# Install Laravel Telescope (optional)
composer require laravel/telescope --dev

# Install monitoring tools
composer require sentry/sentry-laravel
```

### Backup Strategy

```bash
# Daily database backup
0 2 * * * /usr/bin/mysqldump -u user -p database > /backups/moodflix_$(date +\%Y\%m\%d).sql

# Upload to storage
0 3 * * * aws s3 cp /backups/ s3://backups-moodflix/ --recursive
```

### Update Strategy

```bash
# Create maintenance mode
php artisan down --message "Upgrading application..."

# Pull latest changes
git pull origin main

# Install dependencies
composer install
npm install

# Run migrations
php artisan migrate --force

# Clear caches
php artisan cache:clear
php artisan config:clear
php artisan view:clear

# Rebuild assets
npm run build

# Exit maintenance mode
php artisan up
```

---

## Monitoring & Maintenance

### Real-time Monitoring

```bash
# Watch logs
tail -f storage/logs/laravel.log | grep -i error

# Monitor system resources
top
iostat -x 1
netstat -a | grep ESTABLISHED | wc -l
```

### Database Maintenance

```bash
# Weekly optimization
php artisan tinker
>>> DB::statement('OPTIMIZE TABLE genres');
>>> DB::statement('OPTIMIZE TABLE user_movie_interactions');

# Monthly backup
mysqldump -u user -p database > backup_$(date +%Y%m%d).sql
```

### Cache Management

```bash
# Monitor cache
php artisan cache:monitor

# Clear cache if needed
php artisan cache:clear

# Flush old cache
php artisan cache:forget recommendation:*
```

---

## Rollback Procedure

If deployment goes wrong:

```bash
# Enable maintenance mode
php artisan down

# Rollback migrations
php artisan migrate:rollback --step=1

# Revert code
git revert <commit-hash>

# Clear caches
php artisan cache:clear

# Exit maintenance mode
php artisan up
```

---

## Security Checklist

-   [ ] HTTPS enabled
-   [ ] SSL/TLS certificate installed
-   [ ] Security headers configured
-   [ ] CSRF protection enabled
-   [ ] SQL injection prevention
-   [ ] XSS prevention
-   [ ] File upload validation
-   [ ] Rate limiting configured
-   [ ] API rate limiting set
-   [ ] Error messages don't expose paths
-   [ ] Sensitive data not logged
-   [ ] Database credentials secured
-   [ ] API keys in environment variables
-   [ ] Regular security updates scheduled

---

## Environment Variables (Production)

```env
APP_NAME=MOODFLIX
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:xxxxxxxxxxxxx
APP_URL=https://moodflix.example.com

DB_CONNECTION=mysql
DB_HOST=db.production.example.com
DB_PORT=3306
DB_DATABASE=moodflix_prod
DB_USERNAME=moodflix_user
DB_PASSWORD=secure_password_here

CACHE_DRIVER=database
SESSION_DRIVER=cookie
QUEUE_CONNECTION=database

LOG_CHANNEL=single
LOG_LEVEL=error

TMDB_API_KEY=204ec07f01f609366972991007916521
```

---

## Troubleshooting Production Issues

### High Memory Usage

```bash
# Check memory
free -h

# Optimize Laravel
php artisan config:cache
php artisan route:cache

# Clear caches
php artisan cache:clear
php artisan view:clear
```

### Database Connection Issues

```bash
# Test connection
php artisan tinker
>>> DB::connection()->getPDO();

# Check logs
tail -f storage/logs/laravel.log
```

### API Rate Limiting

```bash
# Check TMDB rate limit
php artisan tinker
>>> Cache::get('tmdb_rate_limit:*')
```

### SSL Certificate Issues

```bash
# Check certificate validity
openssl x509 -in /path/to/cert.crt -text -noout

# Verify HTTPS works
curl -I https://moodflix.example.com
```

---

## Incident Response

1. **Detect Issue:** Monitor logs and alerts
2. **Assess Impact:** Check affected services
3. **Enable Maintenance Mode:** `php artisan down`
4. **Investigate:** Review logs and error traces
5. **Fix Issue:** Deploy fix or rollback
6. **Test:** Verify in staging first
7. **Deploy:** Roll out fix to production
8. **Monitor:** Watch for issues
9. **Communicate:** Notify users if needed
10. **Post-Mortem:** Document what happened

---

## Support Contacts

-   **DevOps Team:** devops@company.com
-   **Database Admin:** dba@company.com
-   **Security Team:** security@company.com
-   **Monitoring:** monitoring@company.com

---

**Last Updated:** January 2024  
**Deployment Version:** 1.0.0
