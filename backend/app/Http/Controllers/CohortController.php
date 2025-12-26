<?php

namespace App\Http\Controllers;

use App\Models\Cohort;
use App\Models\Module;
use Illuminate\Http\Request;

class CohortController extends Controller
{
    public function index(Request $request)
    {
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
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'status' => 'required|in:planned,active,completed'
        ]);

        $module = Module::findOrFail($request->module_id);

        // Authorization: Only the teacher of the module should create cohorts
        if ($module->teacher_id !== $request->user()->id) {
            abort(403, 'Unauthorized.');
        }

        $cohort = $module->cohorts()->create($request->all());

        return response()->json($cohort, 201);
    }

    public function update(Request $request, $id)
    {
        $cohort = Cohort::findOrFail($id);

        if ($cohort->module->teacher_id !== $request->user()->id) {
            abort(403, 'Unauthorized.');
        }

        $cohort->update($request->all());

        return response()->json($cohort);
    }
}
