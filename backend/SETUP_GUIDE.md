# Laravel Backend Setup Guide

This guide will help you set up and run the Laravel backend for the Ramay Humour Academy website.

## Prerequisites

✅ **Already Installed:**
- PHP 8.3.6
- Composer 2.9.2
- SQLite
- Laravel 12.44.0
- Laravel Sanctum 4.2.1

## Database Configuration

The application is configured to use SQLite by default.

### Step 1: Setup Database

Run the setup script which will create the SQLite database file and run migrations:

```bash
./setup_database.sh
```

Alternatively, you can manually set it up:

```bash
touch backend/database/database.sqlite
cd backend
php artisan migrate
```

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

DB_CONNECTION=sqlite
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=ramay_humour_academy
# DB_USERNAME=root
# DB_PASSWORD=
```

## Troubleshooting

### "SQLSTATE[HY000] Could not open database"
- Ensure `database/database.sqlite` exists and has write permissions.
- Run `touch backend/database/database.sqlite` if missing.

### CORS errors in browser
- Make sure the backend is running on `http://localhost:8000`
- Check that `config/cors.php` includes your frontend URL
- Clear config cache: `php artisan config:clear`

### "Class 'Laravel\Sanctum\HasApiTokens' not found"
- Run: `composer dump-autoload`

## Security Notes

### Development
- `APP_DEBUG=true` is fine for development

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
