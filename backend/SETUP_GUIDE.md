# Laravel Backend Setup Guide

This guide will help you set up and run the Laravel backend for the Ramay Humour Academy website.

## Prerequisites

✅ **Already Installed:**
- PHP 8.3.6
- Composer 2.9.2
- MySQL 8.0.44
- Laravel 12.44.0
- Laravel Sanctum 4.2.1

## Database Configuration

### Step 1: Set MySQL Root Password (if needed)

If you haven't set a MySQL root password, you can set one or create a dedicated database user.

**Option A: Use MySQL without password (development only)**
The `.env` file is already configured for this.

**Option B: Set a MySQL root password**
```bash
sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
FLUSH PRIVILEGES;
EXIT;
```

Then update the `.env` file:
```bash
cd backend
nano .env  # or use your preferred editor
# Update: DB_PASSWORD=your_password
```

**Option C: Create a dedicated database user**
```bash
sudo mysql
CREATE USER 'ramay_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON ramay_humour_academy.* TO 'ramay_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Then update the `.env` file:
```bash
cd backend
nano .env
# Update:
# DB_USERNAME=ramay_user
# DB_PASSWORD=secure_password
```

### Step 2: Create the Database

```bash
# If using root without password:
mysql -u root -e "CREATE DATABASE IF NOT EXISTS ramay_humour_academy CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# If using root with password:
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS ramay_humour_academy CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# If using dedicated user:
mysql -u ramay_user -p -e "CREATE DATABASE IF NOT EXISTS ramay_humour_academy CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### Step 3: Run Migrations

```bash
cd backend
php artisan migrate
```

This will create the following tables:
- `users` - User accounts
- `password_reset_tokens` - Password reset functionality
- `sessions` - User sessions
- `cache` - Application cache
- `jobs` - Queue jobs
- `personal_access_tokens` - Sanctum authentication tokens

## Running the Backend Server

### Development Server

```bash
cd backend
php artisan serve
```

The backend will be available at `http://localhost:8000`

### Custom Host/Port

```bash
php artisan serve --host=0.0.0.0 --port=8000
```

## Testing the API

### Using cURL

**Register a new user:**
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Get current user (replace TOKEN with actual token):**
```bash
curl -X GET http://localhost:8000/api/user \
  -H "Authorization: Bearer TOKEN" \
  -H "Accept: application/json"
```

**Logout:**
```bash
curl -X POST http://localhost:8000/api/auth/logout \
  -H "Authorization: Bearer TOKEN" \
  -H "Accept: application/json"
```

## Running Frontend and Backend Together

### Terminal 1: Backend
```bash
cd backend
php artisan serve
```

### Terminal 2: Frontend
```bash
npm run dev
```

The frontend will automatically proxy `/api` requests to the Laravel backend.

## Common Commands

### Clear cache
```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

### View routes
```bash
php artisan route:list
```

### Create a new migration
```bash
php artisan make:migration create_table_name
```

### Create a new controller
```bash
php artisan make:controller ControllerName
```

### Run database seeders
```bash
php artisan db:seed
```

### Fresh migration (WARNING: Deletes all data)
```bash
php artisan migrate:fresh
```

## Environment Variables

Key environment variables in `.env`:

```env
APP_NAME=Laravel
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ramay_humour_academy
DB_USERNAME=root
DB_PASSWORD=
```

## Troubleshooting

### "Access denied for user 'root'@'localhost'"
- Set a MySQL password or update `.env` with correct credentials
- See "Database Configuration" section above

### "SQLSTATE[HY000] [2002] Connection refused"
- Make sure MySQL is running: `sudo systemctl status mysql`
- Start MySQL if needed: `sudo systemctl start mysql`

### CORS errors in browser
- Make sure the backend is running on `http://localhost:8000`
- Check that `config/cors.php` includes your frontend URL
- Clear config cache: `php artisan config:clear`

### "Class 'Laravel\Sanctum\HasApiTokens' not found"
- Run: `composer dump-autoload`

## Security Notes

### Development
- `APP_DEBUG=true` is fine for development
- Using root MySQL user is acceptable for local development

### Production
- Set `APP_DEBUG=false`
- Use strong, unique `APP_KEY` (generated automatically)
- Create dedicated database user with limited privileges
- Use HTTPS
- Update `allowed_origins` in `config/cors.php` to your production domain
- Set strong database password
- Configure proper session and cache drivers

## Next Steps

1. ✅ Backend is set up and ready
2. ⏳ Create the database and run migrations
3. ⏳ Test the API endpoints
4. ⏳ Integrate with frontend authentication
5. ⏳ Add additional features (courses, students, etc.)

For API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
