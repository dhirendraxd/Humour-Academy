<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller
{
    use ApiResponse;

    /**
     * Handle a login request to the application.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        // Rate limiting: 5 attempts per minute
        $key = 'login_' . $request->ip();
        if (RateLimiter::tooManyAttempts($key, 5)) {
            return $this->error('Too many login attempts. Please try again in ' . RateLimiter::availableIn($key) . ' seconds.', 429);
        }

        try {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);

            $user = User::where('email', $request->email)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                RateLimiter::hit($key);
                return $this->error('The provided credentials are incorrect.', 401);
            }

            // Revoke all previous tokens
            $user->tokens()->delete();

            // Create new token
            $token = $user->createToken('auth-token')->plainTextToken;

            // Clear rate limit on successful login
            RateLimiter::clear($key);

            return $this->success([
                'user' => $user,
                'token' => $token,
            ], 'Login successful', 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationError($e->errors(), 'Validation failed');
        } catch (\Exception $e) {
            return $this->error('Login failed: ' . $e->getMessage(), 500);
        }
    }
}
