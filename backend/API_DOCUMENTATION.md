# Laravel Backend API Documentation

## Base URL
- Development: `http://localhost:8000/api`
- Frontend Proxy: `/api` (automatically proxied to Laravel backend)

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer {token}
```

---

## Public Endpoints

### Register User
Create a new user account.

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "password_confirmation": "SecurePassword123"
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "email_verified_at": null,
    "created_at": "2025-12-26T09:00:00.000000Z",
    "updated_at": "2025-12-26T09:00:00.000000Z"
  },
  "token": "1|abc123def456..."
}
```

**Validation Rules:**
- `name`: required, string, max 255 characters
- `email`: required, valid email, max 255 characters, unique
- `password`: required, confirmed, meets password requirements

---

### Login User
Authenticate a user and receive an access token.

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "email_verified_at": null,
    "created_at": "2025-12-26T09:00:00.000000Z",
    "updated_at": "2025-12-26T09:00:00.000000Z"
  },
  "token": "2|xyz789abc456..."
}
```

**Error Response:** `422 Unprocessable Entity`
```json
{
  "message": "The provided credentials are incorrect.",
  "errors": {
    "email": ["The provided credentials are incorrect."]
  }
}
```

---

## Protected Endpoints

### Get Current User
Retrieve the authenticated user's information.

**Endpoint:** `GET /api/user`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "email_verified_at": null,
  "created_at": "2025-12-26T09:00:00.000000Z",
  "updated_at": "2025-12-26T09:00:00.000000Z"
}
```

---

### Logout User
Revoke the current access token.

**Endpoint:** `POST /api/auth/logout`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "message": "Successfully logged out"
}
```

---

## Error Responses

### 401 Unauthorized
Returned when authentication is required but not provided or invalid.

```json
{
  "message": "Unauthenticated."
}
```

### 422 Unprocessable Entity
Returned when validation fails.

```json
{
  "message": "The email field is required. (and 1 more error)",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password field is required."]
  }
}
```

### 500 Internal Server Error
Returned when a server error occurs.

```json
{
  "message": "Server Error"
}
```

---

## Using the API from Frontend

### Example: Register
```typescript
import { auth } from '@/lib/auth';

try {
  const response = await auth.register({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'SecurePassword123',
    password_confirmation: 'SecurePassword123'
  });
  console.log('User registered:', response.user);
  // Token is automatically stored
} catch (error) {
  console.error('Registration failed:', error);
}
```

### Example: Login
```typescript
import { auth } from '@/lib/auth';

try {
  const response = await auth.login({
    email: 'john@example.com',
    password: 'SecurePassword123'
  });
  console.log('User logged in:', response.user);
  // Token is automatically stored
} catch (error) {
  console.error('Login failed:', error);
}
```

### Example: Get Current User
```typescript
import { auth } from '@/lib/auth';

try {
  const user = await auth.getUser();
  console.log('Current user:', user);
} catch (error) {
  console.error('Failed to get user:', error);
}
```

### Example: Logout
```typescript
import { auth } from '@/lib/auth';

try {
  await auth.logout();
  console.log('User logged out');
  // Token is automatically removed
} catch (error) {
  console.error('Logout failed:', error);
}
```

---

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:5173` (React development server)

Credentials (cookies, authorization headers) are supported.

---

## Notes

- All tokens are stored in `localStorage` with the key `auth_token`
- Tokens are automatically included in requests to protected endpoints
- Previous tokens are revoked when a user logs in
- The current token is revoked when a user logs out
