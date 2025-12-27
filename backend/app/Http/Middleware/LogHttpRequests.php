<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class LogHttpRequests
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $startTime = microtime(true);

        $response = $next($request);

        $duration = microtime(true) - $startTime;

        Log::channel('api')->info('API Request', [
            'method' => $request->method(),
            'path' => $request->path(),
            'user_id' => auth()->id(),
            'status' => $response->status(),
            'duration_ms' => round($duration * 1000, 2),
            'ip_address' => $request->ip(),
        ]);

        return $response;
    }
}
