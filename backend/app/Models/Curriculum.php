<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Module;

class Curriculum extends Model
{
    protected $table = 'curriculums';
    protected $fillable = ['title', 'description'];

    public function modules()
    {
        return $this->hasMany(Module::class)->orderBy('order_index');
    }
}
