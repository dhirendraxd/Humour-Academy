<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Module;
use App\Traits\LogsActivity;

class Curriculum extends Model
{
    use SoftDeletes, LogsActivity;

    protected $table = 'curriculums';
    protected $fillable = ['title', 'description', 'outcomes', 'prerequisites'];
    protected $dates = ['deleted_at'];

    public function modules()
    {
        return $this->hasMany(Module::class)->orderBy('order_index');
    }
}
