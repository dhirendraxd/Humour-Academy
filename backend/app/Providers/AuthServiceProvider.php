<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Models\Curriculum;
use App\Models\Module;
use App\Models\Assessment;
use App\Models\Cohort;
use App\Policies\CurriculumPolicy;
use App\Policies\ModulePolicy;
use App\Policies\AssessmentPolicy;
use App\Policies\CohortPolicy;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Curriculum::class => CurriculumPolicy::class,
        Module::class => ModulePolicy::class,
        Assessment::class => AssessmentPolicy::class,
        Cohort::class => CohortPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        //
    }
}
