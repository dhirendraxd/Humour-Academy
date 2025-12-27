<?php

namespace App\Http\Controllers;

use App\Models\Cohort;
use App\Models\Module;
use Illuminate\Http\Request;

class CohortController extends Controller
{
    public function index(Request $request)
    {
        // Allow fetching all cohorts for BOD/Admin without module_id
        if (!$request->has('module_id')) {
            // In a real app, strictly check permissions here
            // if ($request->user()->role !== 'bod') abort(403);
            return Cohort::with('module')->withCount('enrollments')->latest()->get();
        }

        $request->validate([
            'module_id' => 'required|exists:modules,id'
        ]);

        return Cohort::where('module_id', $request->module_id)
            ->withCount('enrollments')
            ->latest()
            ->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'module_id' => 'required|exists:modules,id',
            'title' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'status' => 'required|in:planned,active,completed'
        ]);

        // Validate Duration: 1 month min, 3 months max
        $start = \Carbon\Carbon::parse($request->start_date);
        $end = \Carbon\Carbon::parse($request->end_date);
        $diffInMonths = $start->diffInMonths($end);

        if ($diffInMonths < 1 || $diffInMonths > 3) {
            return response()->json(['message' => 'Cohort duration must be between 1 and 3 months.'], 422);
        }

        $module = Module::findOrFail($request->module_id);

        // Authorization: Only the teacher of the module should create cohorts
        if ($module->teacher_id !== $request->user()->id) {
            abort(403, 'Unauthorized.');
        }

        $data = $request->all();

        // Linked Deadline Logic: Registration for this batch closes when the previous batch ends
        $previousCohort = $module->cohorts()->orderBy('end_date', 'desc')->first();
        if ($previousCohort) {
            $data['application_deadline'] = $previousCohort->end_date;
        } else {
            // If first cohort, default deadline to 1 day before start if not provided
            if (!isset($data['application_deadline'])) {
                $data['application_deadline'] = $start->subDay()->toDateString();
            }
        }

        $cohort = $module->cohorts()->create($data);

        return response()->json($cohort, 201);
    }

    public function update(Request $request, $id)
    {
        $cohort = Cohort::findOrFail($id);

        if ($cohort->module->teacher_id !== $request->user()->id) {
            abort(403, 'Unauthorized.');
        }

        $request->validate([
            'start_date' => 'sometimes|required|date',
            'end_date' => 'sometimes|required|date|after:start_date',
            'status' => 'sometimes|required|in:planned,active,completed'
        ]);

        if ($request->has('start_date') || $request->has('end_date')) {
            $start = \Carbon\Carbon::parse($request->start_date ?? $cohort->start_date);
            $end = \Carbon\Carbon::parse($request->end_date ?? $cohort->end_date);
            $diffInMonths = $start->diffInMonths($end);

            if ($diffInMonths < 1 || $diffInMonths > 3) {
                return response()->json(['message' => 'Cohort duration must be between 1 and 3 months.'], 422);
            }
        }

        $cohort->update($request->all());

        return response()->json($cohort);
    }
}
