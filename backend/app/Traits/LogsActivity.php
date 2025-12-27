<?php

namespace App\Traits;

use App\Models\Activity;
use Illuminate\Support\Facades\Auth;

trait LogsActivity
{
    /**
     * Log activity for create, update, delete actions
     */
    public static function bootLogsActivity()
    {
        static::created(function ($model) {
            self::logActivity('created', $model, []);
        });

        static::updated(function ($model) {
            $changes = [];
            foreach ($model->getChanges() as $key => $value) {
                $changes[$key] = [
                    'old' => $model->getOriginal($key),
                    'new' => $value
                ];
            }
            self::logActivity('updated', $model, $changes);
        });

        static::deleted(function ($model) {
            self::logActivity('deleted', $model, $model->toArray());
        });
    }

    /**
     * Create activity log entry
     */
    private static function logActivity(string $action, $model, array $changes)
    {
        Activity::create([
            'user_id' => Auth::id(),
            'action' => $action,
            'model_type' => get_class($model),
            'model_id' => $model->id,
            'changes' => $changes,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}
