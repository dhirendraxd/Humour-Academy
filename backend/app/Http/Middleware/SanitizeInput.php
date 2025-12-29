<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SanitizeInput
{
    /**
     * Keys that may contain limited HTML; allow a safe subset of tags.
     * Adjust this allowlist as your models/controllers require.
     */
    protected array $htmlAllowed = [
        'content', 'body', 'description', 'html', 'message'
    ];

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        if ($request->isMethod('GET')) {
            return $next($request);
        }

        $sanitized = $this->sanitizeArray($request->all());
        $request->merge($sanitized);

        return $next($request);
    }

    /**
     * Recursively sanitize an array of input data.
     */
    protected function sanitizeArray(array $data, array $path = []): array
    {
        foreach ($data as $key => $value) {
            $currentPath = array_merge($path, [$key]);

            if (is_array($value)) {
                $data[$key] = $this->sanitizeArray($value, $currentPath);
                continue;
            }

            if (is_string($value)) {
                $data[$key] = $this->sanitizeString($value, $key);
            }
        }

        return $data;
    }

    /**
     * Sanitize a string: trim, strip control chars, and strip HTML tags
     * (allowing a safe subset for whitelisted keys).
     */
    protected function sanitizeString(string $value, string $key): string
    {
        // Normalize whitespace and strip control characters (except newlines/tabs)
        $value = preg_replace("/\p{C}+/u", '', $value ?? '');
        $value = trim($value);

        // Allow a limited set of tags only for specific fields
        if (in_array($key, $this->htmlAllowed, true)) {
            $allowed = '<b><strong><i><em><u><a><p><ul><ol><li><br><span>'; 
            $value = strip_tags($value, $allowed);
            // Remove javascript: and data: protocols in href/src
            $value = preg_replace('/(javascript:|data:)/i', '', $value);
            return $value;
        }

        // Default: no HTML allowed
        return strip_tags($value);
    }
}
