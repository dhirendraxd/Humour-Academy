<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Apply security headers to all routes
        $middleware->append(\App\Http\Middleware\SecurityHeaders::class);

        // Sanitize all non-GET request inputs
        $middleware->append(\App\Http\Middleware\SanitizeInput::class);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
