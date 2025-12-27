<?php

namespace App\Policies;

use App\Models\Cohort;
use App\Models\User;

class CohortPolicy
{
    /**
     * Determine if the user can view any cohort
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine if the user can view the cohort
     */
    public function view(User $user, Cohort $cohort): bool
    {
        return true;
    }

    /**
     * Determine if the user can create a cohort
     */
    public function create(User $user): bool
    {
        return $user->role === 'faculty' || $user->role === 'bod';
    }

    /**
     * Determine if the user can update the cohort
     */
    public function update(User $user, Cohort $cohort): bool
    {
        return $user->role === 'faculty' || $user->role === 'bod';
    }

    /**
     * Determine if the user can delete the cohort
     */
    public function delete(User $user, Cohort $cohort): bool
    {
        return $user->role === 'bod';
    }
}
