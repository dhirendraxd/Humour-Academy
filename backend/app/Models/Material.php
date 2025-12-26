<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    protected $fillable = [
        'faculty_id',
        'title',
        'description',
        'file_url',
        'learning_objectives',
        'prerequisites',
        'estimated_study_time',
        'resource_type',
        'module_breakdown',
    ];

    protected $casts = [
        'learning_objectives' => 'array',
    ];

    public function faculty()
    {
        return $this->belongsTo(User::class, 'faculty_id');
    }
}
