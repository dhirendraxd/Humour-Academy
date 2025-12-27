<?php

namespace App\Http\Controllers;

use App\Models\Cohort;
use App\Models\Module;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CohortController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = Cohort::with('module.teacher')->withCount('enrollments');

        if ($request->has('module_id')) {
            $query->where('module_id', $request->module_id);
        }

        if ($request->search) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $cohorts = $query->latest()->paginate(15);
        return $this->successWithPagination($cohorts, 'Cohorts retrieved successfully');
    }

    public function store(Request $request)
    {
        $request->validate([
            'module_id' => 'required|exists:modules,id',
            'title' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'status' => 'required|in:planned,active,completed',
            'capacity' => 'required|integer|min:1'
        ]);

        // Validate Duration: 1 month min, 3 months max
        $start = \Carbon\Carbon::parse($request->start_date);
        $end = \Carbon\Carbon::parse($request->end_date);
        $diffInMonths = $start->diffInMonths($end);

        if ($diffInMonths < 1 || $diffInMonths > 3) {
            return $this->error('Cohort duration must be between 1 and 3 months.', 422);
        }

        $module = Module::findOrFail($request->module_id);

        // Authorization: Only the teacher of the module should create cohorts
        if ($module->teacher_id !== $request->user()->id && $request->user()->role !== 'bod') {
            return $this->unauthorized('Only the module teacher can create cohorts');
        }

        // Use transaction for atomicity
        return DB::transaction(function () use ($request, $module, $start) {
            $data = $request->all();

            // Linked Deadline Logic: Registration for this batch closes when the previous batch ends
            $previousCohort = $module->cohorts()->orderBy('end_date', 'desc')->first();
            if ($previousCohort) {
                $data['application_deadline'] = $previousCohort->end_date;
            } else {
                if (!isset($data['application_deadline'])) {
                    $data['application_deadline'] = $start->subDay()->toDateString();
                }
            }

            $cohort = $module->cohorts()->create($data);

            return $this->success($cohort, 'Cohort created successfully', 201);
        });
    }

    public function show($id)
    {
        $cohort = Cohort::with(['module.teacher', 'enrollments.student'])->withCount('enrollments')->findOrFail($id);
        return $this->success($cohort, 'Cohort retrieved successfully');
    }

    public function update(Request $request, $id)
    {
        $cohort = Cohort::findOrFail($id);

        if ($cohort->module->teacher_id !== $request->user()->id && $request->user()->role !== 'bod') {
            return $this->unauthorized('Only the module teacher can update cohorts');
        }

        $request->validate([
            'start_date' => 'sometimes|required|date',
            'end_date' => 'sometimes|required|date|after:start_date',
            'status' => 'sometimes|required|in:planned,active,completed',
            'capacity' => 'sometimes|required|integer|min:1'
        ]);

        if ($request->has('start_date') || $request->has('end_date')) {
            $start = \Carbon\Carbon::parse($request->start_date ?? $cohort->start_date);
            $end = \Carbon\Carbon::parse($request->end_date ?? $cohort->end_date);
            $diffInMonths = $start->diffInMonths($end);

            if ($diffInMonths < 1 || $diffInMonths > 3) {
                return $this->error('Cohort duration must be between 1 and 3 months.', 422);
            }
        }

        $cohort->update($request->all());

        return $this->success($cohort, 'Cohort updated successfully');
    }

    public function destroy($id)
    {
        $cohort = Cohort::findOrFail($id);

        if ($cohort->module->teacher_id !== auth()->id() && auth()->user()->role !== 'bod') {
            return $this->unauthorized('Only the module teacher can delete cohorts');
        }

        $cohort->delete();
        return $this->success(null, 'Cohort deleted successfully');
    }
}
