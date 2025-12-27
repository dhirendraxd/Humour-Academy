<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    protected $fillable = [
        'user_id',
        'action',
        'model_type',
        'model_id',
        'changes',
        'ip_address',
        'user_agent'
    ];

    protected $casts = [
        'changes' => 'array',
    ];

    /**
     * Get the user associated with the activity
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
