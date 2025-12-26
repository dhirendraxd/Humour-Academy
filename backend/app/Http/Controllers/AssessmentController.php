<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Assessment;

class AssessmentController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'faculty') {
            return $user->assessments()->with('questions')->latest()->get();
        }

        // Student access: Approved cohorts only
        $approvedCohortIds = $user->enrollments()->where('status', 'approved')->pluck('cohort_id');

        return Assessment::whereIn('cohort_id', $approvedCohortIds)
            ->with('questions')
            ->latest()
            ->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|string',
            'total_marks' => 'required|integer',
            'due_date' => 'nullable|date',
            'cohort_id' => 'required|exists:cohorts,id',
            'questions' => 'required|array|min:1',
            'questions.*.type' => 'required|string',
            'questions.*.question' => 'required|string',
            'questions.*.points' => 'required|integer',
            'questions.*.options' => 'nullable|array',
            'questions.*.correct_answer' => 'nullable|string',
            'questions.*.explanation' => 'nullable|string',
            'questions.*.difficulty' => 'nullable|string',
            'questions.*.category_tag' => 'nullable|string',
        ]);

        $assessment = $request->user()->assessments()->create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'type' => $validated['type'],
            'total_marks' => $validated['total_marks'],
            'due_date' => $validated['due_date'],
            'cohort_id' => $validated['cohort_id'],
        ]);

        foreach ($validated['questions'] as $qData) {
            $assessment->questions()->create($qData);
        }

        return response()->json($assessment->load('questions'), 201);
    }

    public function show(Request $request, $id)
    {
        return $request->user()->assessments()->with('questions')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $assessment = $request->user()->assessments()->findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'sometimes|required|string',
            'total_marks' => 'sometimes|required|integer',
            'due_date' => 'nullable|date',
            'questions' => 'nullable|array',
        ]);

        $assessment->update($request->only(['title', 'description', 'type', 'total_marks', 'due_date']));

        if ($request->has('questions')) {
            $assessment->questions()->delete();
            foreach ($request->questions as $qData) {
                $assessment->questions()->create($qData);
            }
        }

        return response()->json($assessment->load('questions'));
    }

    public function destroy(Request $request, $id)
    {
        $assessment = $request->user()->assessments()->findOrFail($id);
        $assessment->delete();
        return response()->json(['message' => 'Assessment deleted']);
    }
}
