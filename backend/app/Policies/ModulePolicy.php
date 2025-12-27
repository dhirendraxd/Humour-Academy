<?php

namespace App\Policies;

use App\Models\Module;
use App\Models\User;

class ModulePolicy
{
    /**
     * Determine if the user can view any module
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine if the user can view the module
     */
    public function view(User $user, Module $module): bool
    {
        return true;
    }

    /**
     * Determine if the user can create a module
     */
    public function create(User $user): bool
    {
        return $user->role === 'bod';
    }

    /**
     * Determine if the user can update the module
     */
    public function update(User $user, Module $module): bool
    {
        return $user->role === 'bod';
    }

    /**
     * Determine if the user can delete the module
     */
    public function delete(User $user, Module $module): bool
    {
        return $user->role === 'bod';
    }
}
