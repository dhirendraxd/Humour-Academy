<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeacherApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'specialization',
        'experience_summary',
        'resume_link',
        'status',
        'bod_notes'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
