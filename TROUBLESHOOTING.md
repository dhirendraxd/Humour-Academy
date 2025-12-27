# Troubleshooting Guide

## Data Not Fetching from Backend

### 1. Check Backend Server Status

Ensure the Laravel backend is running:

```sh
cd backend
php artisan serve
```

The backend should be accessible at `http://localhost:8000`

### 2. Check Frontend Dev Server

Make sure the frontend is running:

```sh
npm run dev
```

The frontend should be accessible at `http://localhost:5173`

### 3. Verify API Proxy Configuration

The Vite dev server proxies `/api` requests to `http://localhost:8000`. Check:

- Port 5173 is used for frontend dev server
- Port 8000 is used for backend server
- Vite config has correct proxy setup (should point to `http://localhost:8000`)

### 4. Database Setup

If you see "No data" or empty lists:

```sh
cd backend

# Check if database exists
php artisan db:show

# Run migrations
php artisan migrate

# Seed the database with test data
php artisan db:seed
```

### 5. Browser Console Debugging

Open DevTools (F12) and check the Console tab for API errors:

```
[API] GET /api/curriculums
[API] Response: [...]
```

If you see network errors like 404 or 500, the backend isn't responding correctly.

### 6. Common Issues

#### Issue: "Cannot GET /api/..."
- **Cause**: Backend not running or proxy misconfigured
- **Solution**: Start `php artisan serve` and verify port 8000

#### Issue: CORS Errors
- **Cause**: CORS not configured in Laravel
- **Solution**: Check `backend/config/cors.php` allows `http://localhost:5173`

#### Issue: Empty Data Lists
- **Cause**: Database not seeded with data
- **Solution**: Run `php artisan db:seed` in the backend directory

#### Issue: 401 Unauthorized Errors
- **Cause**: Missing or expired authentication token
- **Solution**: Log in again or check token in localStorage

### 7. Full System Reset

If nothing works, reset the entire system:

```sh
# Backend
cd backend
php artisan migrate:fresh --seed
php artisan serve

# Frontend (in new terminal from project root)
npm install
npm run dev
```

### 8. Check Environment Variables

**Frontend** - Create `.env.local`:
```
VITE_API_URL=/api
```

**Backend** - Check `backend/.env`:
```
APP_DEBUG=true
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ramay_humour_academy
DB_USERNAME=root
DB_PASSWORD=your_password
```

### 9. Network Requests Monitoring

In browser DevTools Network tab:
1. Look for API requests (should start with `/api`)
2. Check response status (200 is good, 404/500 means error)
3. Verify response has data (not empty or error message)

### 10. API Testing with cURL

Test the API directly from terminal:

```sh
# Get all curricula
curl -X GET http://localhost:8000/api/curriculums

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"bod@academy.com","password":"password123"}'
```

## Still Not Working?

1. Check logs:
   - Frontend: Browser Console (F12)
   - Backend: `backend/storage/logs/laravel.log`

2. Verify all services are running:
   - MySQL database
   - Laravel backend server
   - Vite frontend dev server

3. Ensure ports are available:
   - 5173 for frontend
   - 8000 for backend
   - 3306 for MySQL

4. Clear caches:
   ```sh
   # Backend
   cd backend
   php artisan cache:clear
   php artisan config:clear
   
   # Frontend
   rm -rf node_modules package-lock.json
   npm install
   ```
