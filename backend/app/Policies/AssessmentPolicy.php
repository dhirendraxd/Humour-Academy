<?php

namespace App\Policies;

use App\Models\Assessment;
use App\Models\User;

class AssessmentPolicy
{
    /**
     * Determine if the user can view any assessment
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine if the user can view the assessment
     */
    public function view(User $user, Assessment $assessment): bool
    {
        return true;
    }

    /**
     * Determine if the user can create an assessment
     */
    public function create(User $user): bool
    {
        return $user->role === 'faculty' || $user->role === 'bod';
    }

    /**
     * Determine if the user can update the assessment
     */
    public function update(User $user, Assessment $assessment): bool
    {
        return $user->role === 'faculty' || $user->role === 'bod';
    }

    /**
     * Determine if the user can delete the assessment
     */
    public function delete(User $user, Assessment $assessment): bool
    {
        return $user->role === 'faculty' || $user->role === 'bod';
    }
}
