<?php

namespace App\Http\Controllers;

use App\Models\Cohort;
use App\Models\Enrollment;
use App\Models\Notification;
use App\Models\Module;
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
            'cohort_id' => 'nullable|exists:cohorts,id',
            'curriculum_id' => 'nullable|exists:curriculums,id'
        ]);

        $student = $request->user();
        $cohortId = $request->cohort_id;

        // If curriculum_id is provided, find the cohort for the first module
        if ($request->curriculum_id) {
            $module = Module::where('curriculum_id', $request->curriculum_id)
                ->where('order_index', 1)
                ->firstOrFail();

            // Find the earliest cohort that hasn't passed its application deadline
            $cohort = Cohort::where('module_id', $module->id)
                ->where('application_deadline', '>=', now()->toDateString())
                ->orderBy('application_deadline', 'asc')
                ->first();

            if (!$cohort) {
                return response()->json(['message' => 'No active cohort with open registration found for the first module of this curriculum.'], 404);
            }
            $cohortId = $cohort->id;
        }

        if (!$cohortId) {
            return response()->json(['message' => 'Cohort ID or Curriculum ID is required.'], 400);
        }

        $cohort = Cohort::with('module')->findOrFail($cohortId);
        $module = $cohort->module;

        // NEW: Check if applying for a specific cohort (not via curriculum) is within deadline
        if (!$request->curriculum_id && $cohort->application_deadline < now()->toDateString()) {
            return response()->json(['message' => 'The registration deadline for this cohort has passed.'], 403);
        }

        // 1. Check if already enrolled in THIS cohort
        $existing = Enrollment::where('student_id', $student->id)
            ->where('cohort_id', $cohortId)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Already applied for this cohort'], 400);
        }

        // 2. Sequential Progression Enforcement (only if not Module 1)
        if ($module->order_index > 1) {
            $prevModuleIndex = $module->order_index - 1;
            $prereqEnrollment = Enrollment::where('student_id', $student->id)
                ->whereHas('cohort', function ($q) use ($module, $prevModuleIndex) {
                    $q->whereHas('module', function ($mq) use ($module, $prevModuleIndex) {
                        $mq->where('curriculum_id', $module->curriculum_id)
                            ->where('order_index', $prevModuleIndex);
                    });
                })->whereIn('status', ['approved', 'completed'])
                ->first();

            if (!$prereqEnrollment) {
                return response()->json([
                    'message' => "Prerequisite required: You must be enrolled and approved for the previous module before applying for this one."
                ], 403);
            }
        }

        $enrollment = Enrollment::create([
            'student_id' => $student->id,
            'cohort_id' => $cohortId,
            'status' => 'pending',
            'application_details' => $request->application_details
        ]);

        // 3. Notify the Module Teacher
        Notification::create([
            'user_id' => $module->teacher_id,
            'title' => 'New Enrollment Application',
            'message' => "{$student->name} has applied for {$module->title} ({$cohort->title})",
            'type' => 'enrollment_request',
            'data' => [
                'enrollment_id' => $enrollment->id,
                'student_name' => $student->name,
                'module_title' => $module->title
            ]
        ]);

        return response()->json($enrollment, 201);
    }

    public function update(Request $request, $id)
    {
        $enrollment = Enrollment::with('cohort.module')->findOrFail($id);

        // Authorization: Only the teacher of the cohort's module
        if ($enrollment->cohort->module->teacher_id !== $request->user()->id) {
            abort(403, 'Unauthorized.');
        }

        $request->validate([
            'status' => 'required|in:approved,rejected,completed'
        ]);

        // Enforcement: If approving (status=approved) and NOT Module 1, check if previous module is COMPLETED
        if ($request->status === 'approved' && $enrollment->cohort->module->order_index > 1) {
            $prevIndex = $enrollment->cohort->module->order_index - 1;
            $prevCompleted = Enrollment::where('student_id', $enrollment->student_id)
                ->whereHas('cohort', function ($q) use ($enrollment, $prevIndex) {
                    $q->whereHas('module', function ($mq) use ($enrollment, $prevIndex) {
                        $mq->where('curriculum_id', $enrollment->cohort->module->curriculum_id)
                            ->where('order_index', $prevIndex);
                    });
                })->where('status', 'completed')
                ->exists();

            if (!$prevCompleted) {
                return response()->json(['message' => 'Cannot approve yet. The student must first complete the previous module.'], 403);
            }
        }

        $enrollment->update(['status' => $request->status]);

        // Notify Student
        if ($request->status === 'approved') {
            Notification::create([
                'user_id' => $enrollment->student_id,
                'title' => 'Application Approved!',
                'message' => "Your application for {$enrollment->cohort->module->title} has been approved. You now have access to the learning materials.",
                'type' => 'enrollment_approved',
                'data' => [
                    'module_id' => $enrollment->cohort->module_id,
                    'cohort_id' => $enrollment->cohort_id
                ]
            ]);
        }

        if ($request->status === 'completed') {
            Notification::create([
                'user_id' => $enrollment->student_id,
                'title' => 'Module Completed!',
                'message' => "Congratulations! You have successfully completed {$enrollment->cohort->module->title}. You can now apply for the next module.",
                'type' => 'module_completed',
                'data' => [
                    'module_id' => $enrollment->cohort->module_id,
                    'order_index' => $enrollment->cohort->module->order_index
                ]
            ]);
        }

        return response()->json($enrollment);
    }
}
