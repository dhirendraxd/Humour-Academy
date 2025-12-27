<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait SanitizesInput
{
    /**
     * Sanitize input to prevent XSS attacks
     * 
     * @param string $value
     * @return string
     */
    public function sanitizeInput($value): string
    {
        if (!is_string($value)) {
            return $value;
        }

        // Remove tags
        $value = Str::stripTags($value);
        
        // Convert special characters to HTML entities
        $value = htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
        
        // Remove extra whitespace
        $value = trim($value);

        return $value;
    }

    /**
     * Sanitize array of inputs
     * 
     * @param array $data
     * @param array $fields Fields to sanitize (null = all)
     * @return array
     */
    public function sanitizeArray(array $data, ?array $fields = null): array
    {
        $fieldsToSanitize = $fields ?? array_keys($data);

        foreach ($fieldsToSanitize as $field) {
            if (isset($data[$field]) && is_string($data[$field])) {
                $data[$field] = $this->sanitizeInput($data[$field]);
            }
        }

        return $data;
    }
}
