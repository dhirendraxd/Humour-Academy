<?php

namespace App\Policies;

use App\Models\Curriculum;
use App\Models\User;

class CurriculumPolicy
{
    /**
     * Determine if the user can view any curriculum
     */
    public function viewAny(User $user): bool
    {
        return true; // Public endpoint
    }

    /**
     * Determine if the user can view the curriculum
     */
    public function view(User $user, Curriculum $curriculum): bool
    {
        return true; // Public endpoint
    }

    /**
     * Determine if the user can create a curriculum
     */
    public function create(User $user): bool
    {
        return $user->role === 'bod';
    }

    /**
     * Determine if the user can update the curriculum
     */
    public function update(User $user, Curriculum $curriculum): bool
    {
        return $user->role === 'bod';
    }

    /**
     * Determine if the user can delete the curriculum
     */
    public function delete(User $user, Curriculum $curriculum): bool
    {
        return $user->role === 'bod';
    }
}
