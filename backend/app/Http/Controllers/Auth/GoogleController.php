<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;

class GoogleController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function callback(Request $request)
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
        } catch (\Exception $e) {
            return redirect($this->frontendUrl('/auth?error=google_login_failed'));
        }

        $email = $googleUser->getEmail();
        if (!$email) {
            return redirect($this->frontendUrl('/auth?error=email_missing'));
        }

        $user = User::firstOrCreate(
            ['email' => $email],
            [
                'name' => $googleUser->getName() ?: explode('@', $email)[0],
                'role' => 'student',
                'password' => Hash::make(bin2hex(random_bytes(16))),
            ]
        );

        $token = $user->createToken('web')->plainTextToken;

        // Redirect back to frontend with token
        $url = $this->frontendUrl('/auth?token=' . urlencode($token));
        return redirect($url);
    }

    protected function frontendUrl(string $path): string
    {
        $base = rtrim(config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:5173')), '/');
        return $base . $path;
    }
}
