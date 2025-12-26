<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\CurriculumController;
use App\Http\Controllers\CohortController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ProfileController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public authentication routes
Route::post('/auth/register', [RegisterController::class, 'register']);
Route::post('/auth/login', [LoginController::class, 'login']);

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [LogoutController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::put('/user/profile', [App\Http\Controllers\ProfileController::class, 'update']);

    // Curriculum & Module routes
    Route::get('/curriculums', [CurriculumController::class, 'index']);
    Route::post('/curriculums', [CurriculumController::class, 'store']);
    Route::get('/modules', [ModuleController::class, 'index']);
    Route::post('/modules', [ModuleController::class, 'store']);
    Route::get('/modules/{id}', [ModuleController::class, 'show']);

    // Cohort routes
    Route::get('/cohorts', [CohortController::class, 'index']);
    Route::post('/cohorts', [CohortController::class, 'store']);
    Route::put('/cohorts/{id}', [CohortController::class, 'update']);

    // Enrollment routes
    Route::get('/enrollments', [EnrollmentController::class, 'index']);
    Route::post('/enrollments', [EnrollmentController::class, 'store']);
    Route::put('/enrollments/{id}', [EnrollmentController::class, 'update']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::put('/notifications/{id}', [NotificationController::class, 'update']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);

    // Events
    Route::get('/events', [EventController::class, 'index']);
    Route::post('/events', [EventController::class, 'store']);
    Route::put('/events/{id}', [EventController::class, 'update']);
    Route::delete('/events/{id}', [EventController::class, 'destroy']);

    // Materials
    Route::get('/materials', [App\Http\Controllers\MaterialController::class, 'index']);
    Route::post('/materials', [App\Http\Controllers\MaterialController::class, 'store']);
    Route::put('/materials/{id}', [App\Http\Controllers\MaterialController::class, 'update']);
    Route::delete('/materials/{id}', [App\Http\Controllers\MaterialController::class, 'destroy']);

    // Assessments
    Route::get('/assessments', [App\Http\Controllers\AssessmentController::class, 'index']);
    Route::post('/assessments', [App\Http\Controllers\AssessmentController::class, 'store']);
    Route::get('/assessments/{id}', [App\Http\Controllers\AssessmentController::class, 'show']);
    Route::put('/assessments/{id}', [App\Http\Controllers\AssessmentController::class, 'update']);
    Route::delete('/assessments/{id}', [App\Http\Controllers\AssessmentController::class, 'destroy']);

    // Grading
    Route::get('/grading/submissions', [App\Http\Controllers\GradingController::class, 'index']);
    Route::put('/grading/submissions/{id}', [App\Http\Controllers\GradingController::class, 'update']);
});
