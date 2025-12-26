<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Cohort;

class Enrollment extends Model
{
    protected $fillable = ['student_id', 'cohort_id', 'status'];

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function cohort()
    {
        return $this->belongsTo(Cohort::class);
    }
}
