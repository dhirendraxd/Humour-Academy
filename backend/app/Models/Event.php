<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
        'teacher_id',
        'title',
        'description',
        'type',
        'date',
        'time',
        'location_url',
        'details',
        'agenda',
        'learning_outcomes',
        'itinerary'
    ];

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }
}
