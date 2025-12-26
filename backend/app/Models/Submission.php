<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    protected $fillable = [
        'assessment_id',
        'student_id',
        'submitted_at',
        'total_score',
        'graded',
        'graded_at',
        'feedback',
        'answers',
    ];

    protected $casts = [
        'answers' => 'array',
        'graded' => 'boolean',
    ];

    public function assessment()
    {
        return $this->belongsTo(Assessment::class);
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }
}
