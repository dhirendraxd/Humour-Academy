<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SecurityHeaders
{
    /**
     * Handle an incoming request and add security-related headers.
     */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        $isLocal = app()->environment('local');

        // CSP: relax for local (Vite dev server), stricter for production
        if ($isLocal) {
            $csp = "default-src 'self'; " .
                "connect-src 'self' http://localhost:8000 http://127.0.0.1:8000 ws://localhost:5173 ws://127.0.0.1:5173 http://localhost:5173 http://127.0.0.1:5173; " .
                "img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; " .
                "script-src 'self' 'unsafe-inline' 'unsafe-eval'; font-src 'self' data:; frame-ancestors 'none'; base-uri 'self'; form-action 'self';";
        } else {
            $csp = "default-src 'self'; connect-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; font-src 'self' data:; frame-ancestors 'none'; base-uri 'self'; form-action 'self';";
        }

        $headers = [
            'X-Content-Type-Options' => 'nosniff',
            'X-Frame-Options' => 'DENY',
            'Referrer-Policy' => 'no-referrer',
            'Permissions-Policy' => "camera=(), microphone=(), geolocation=()",
            'Cross-Origin-Opener-Policy' => 'same-origin',
            'Content-Security-Policy' => $csp,
        ];

        foreach ($headers as $key => $val) {
            if (!$response->headers->has($key)) {
                $response->headers->set($key, $val);
            }
        }

        // Optional HSTS in production (requires HTTPS)
        if (!$isLocal) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
        }

        return $response;
    }
}
