<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class PasswordlessController extends Controller
{
    public function requestCode(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);
        if ($validator->fails()) {
            return response()->json(['message' => 'Invalid email'], 422);
        }

        $email = strtolower($request->input('email'));
        $code = random_int(100000, 999999);
        $hash = Hash::make((string)$code);
        Cache::put("otp:$email", $hash, now()->addMinutes(10));

        // In local/dev, return code to client for convenience
        $payload = ['message' => 'Login code sent'];
        if (app()->environment('local')) {
            $payload['dev_code'] = $code;
        }

        // NOTE: In production, send via mail/SMS instead of returning code.
        return response()->json($payload);
    }

    public function verifyCode(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'code' => 'required|digits:6',
        ]);
        if ($validator->fails()) {
            return response()->json(['message' => 'Invalid request'], 422);
        }

        $email = strtolower($request->input('email'));
        $code = $request->input('code');

        $hash = Cache::get("otp:$email");
        if (!$hash || !Hash::check((string)$code, $hash)) {
            return response()->json(['message' => 'Invalid or expired code'], 401);
        }

        Cache::forget("otp:$email");

        // Find or create user (default role student)
        $user = User::firstOrCreate(
            ['email' => $email],
            [
                'name' => explode('@', $email)[0],
                'role' => 'student',
                'password' => Hash::make(bin2hex(random_bytes(16))),
            ]
        );

        $token = $user->createToken('web')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }
}
