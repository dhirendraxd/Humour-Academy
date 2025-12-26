<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\RegisterController;
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

    // Course routes
    Route::get('/courses', [App\Http\Controllers\CourseController::class, 'index']);
    Route::post('/courses', [App\Http\Controllers\CourseController::class, 'store']); // Teacher create course

    // Enrollment routes
    Route::post('/enrollments', [App\Http\Controllers\EnrollmentController::class, 'store']); // Student apply
    Route::get('/active-enrollments', [App\Http\Controllers\EnrollmentController::class, 'index']); // Teacher view requests
    Route::put('/enrollments/{id}', [App\Http\Controllers\EnrollmentController::class, 'update']); // Teacher approve/reject
});
