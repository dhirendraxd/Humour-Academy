<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = [
        'assessment_id',
        'type',
        'question',
        'points',
        'options',
        'correct_answer',
        'explanation',
        'difficulty',
        'category_tag',
    ];

    protected $casts = [
        'options' => 'array',
    ];

    public function assessment()
    {
        return $this->belongsTo(Assessment::class);
    }
}
