<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class RegisterController extends Controller
{
    use ApiResponse;

    /**
     * Handle a registration request for the application.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'role' => 'nullable|string|in:student,faculty,bod',
                'password' => ['required', 'confirmed', Password::min(8)->mixedCase()->numbers()],
                'bio' => 'nullable|string|max:1000',
                'city' => 'nullable|string|max:255',
                'phone' => 'nullable|string|max:20',
                'interests' => 'nullable|array',
                'interests.*' => 'string',
            ]);

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'role' => $request->role ?? 'student',
                'password' => Hash::make($request->password),
                'bio' => $request->bio,
                'city' => $request->city,
                'phone' => $request->phone,
                'interests' => $request->interests,
            ]);

            // Create token for the new user
            $token = $user->createToken('auth-token')->plainTextToken;

            return $this->success([
                'user' => $user,
                'token' => $token,
            ], 'User registered successfully', 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationError($e->errors(), 'Validation failed');
        } catch (\Exception $e) {
            return $this->error('Registration failed: ' . $e->getMessage(), 500);
        }
    }
}
