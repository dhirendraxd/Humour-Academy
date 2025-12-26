<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Enrollment;
use App\Models\User;
use App\Models\Curriculum;
use App\Models\Cohort;

class Module extends Model
{
    protected $fillable = ['title', 'description', 'teacher_id', 'curriculum_id', 'order_index', 'duration_months'];

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function curriculum()
    {
        return $this->belongsTo(Curriculum::class);
    }

    public function cohorts()
    {
        return $this->hasMany(Cohort::class);
    }
}
