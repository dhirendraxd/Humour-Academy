<?php

namespace App\Http\Controllers;

use App\Models\Cohort;
use App\Models\Enrollment;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    public function index(Request $request)
    {
        // If teacher, show applications for their cohorts
        if ($request->user()->role === 'faculty') {
            $cohortIds = Cohort::whereHas('module', function ($q) use ($request) {
                $q->where('teacher_id', $request->user()->id);
            })->pluck('id');

            return Enrollment::whereIn('cohort_id', $cohortIds)
                ->with(['student', 'cohort.module'])
                ->latest()
                ->get();
        }

        // If student, show their enrollments
        return $request->user()->enrollments()->with('cohort.module.teacher')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'cohort_id' => 'required|exists:cohorts,id'
        ]);

        // Check if already enrolled
        $existing = Enrollment::where('student_id', $request->user()->id)
            ->where('cohort_id', $request->cohort_id)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Already applied for this cohort'], 400);
        }

        $enrollment = Enrollment::create([
            'student_id' => $request->user()->id,
            'cohort_id' => $request->cohort_id,
            'status' => 'pending'
        ]);

        return response()->json($enrollment, 201);
    }

    public function update(Request $request, $id)
    {
        $enrollment = Enrollment::findOrFail($id);

        // Authorization: Only the teacher of the cohort's module
        if ($enrollment->cohort->module->teacher_id !== $request->user()->id) {
            abort(403, 'Unauthorized.');
        }

        $request->validate([
            'status' => 'required|in:approved,rejected'
        ]);

        $enrollment->update(['status' => $request->status]);

        return response()->json($enrollment);
    }
}
