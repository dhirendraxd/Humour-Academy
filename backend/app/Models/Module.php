<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Enrollment;
use App\Models\User;
use App\Models\Curriculum;
use App\Models\Cohort;
use App\Traits\LogsActivity;

class Module extends Model
{
    use SoftDeletes, LogsActivity;

    protected $fillable = ['title', 'description', 'teacher_id', 'curriculum_id', 'order_index', 'duration_months'];
    protected $dates = ['deleted_at'];

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
