<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Assessment extends Model
{
    protected $fillable = [
        'faculty_id',
        'title',
        'description',
        'type',
        'total_marks',
        'due_date',
    ];

    public function faculty()
    {
        return $this->belongsTo(User::class, 'faculty_id');
    }

    public function questions()
    {
        return $this->hasMany(Question::class);
    }

    public function submissions()
    {
        return $this->hasMany(Submission::class);
    }
}
