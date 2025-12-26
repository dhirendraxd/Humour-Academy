<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Submission;

class GradingController extends Controller
{
    public function index(Request $request)
    {
        $assessmentIds = $request->user()->assessments()->pluck('id');

        return Submission::whereIn('assessment_id', $assessmentIds)
            ->with(['student', 'assessment'])
            ->latest()
            ->get();
    }

    public function update(Request $request, $id)
    {
        $submission = Submission::findOrFail($id);
        $assessment = $submission->assessment;

        if ($assessment->faculty_id !== $request->user()->id) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'total_score' => 'required|integer',
            'feedback' => 'nullable|string',
            'graded' => 'boolean',
        ]);

        $submission->update($validated + [
            'graded_at' => now(),
            'graded' => true
        ]);

        return response()->json($submission);
    }
}
