<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Module;
use App\Models\Enrollment;
use App\Traits\LogsActivity;

class Cohort extends Model
{
    use SoftDeletes, LogsActivity;

    protected $fillable = ['module_id', 'title', 'start_date', 'application_deadline', 'end_date', 'status', 'capacity'];
    protected $dates = ['deleted_at'];

    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }
}
