<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\LogsActivity;

class Assessment extends Model
{
    use SoftDeletes, LogsActivity;

    protected $fillable = [
        'faculty_id',
        'cohort_id',
        'title',
        'description',
        'type',
        'total_marks',
        'due_date',
    ];

    protected $dates = ['deleted_at'];

    public function faculty()
    {
        return $this->belongsTo(User::class, 'faculty_id');
    }

    public function cohort()
    {
        return $this->belongsTo(Cohort::class);
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
