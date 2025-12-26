<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Module;
use App\Models\Enrollment;

class Cohort extends Model
{
    protected $fillable = ['module_id', 'title', 'start_date', 'application_deadline', 'end_date', 'status', 'capacity'];

    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }
}
