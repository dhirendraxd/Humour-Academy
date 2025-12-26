<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Event;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user && $user->role === 'faculty') {
            return Event::with('teacher')->latest()->get();
        }

        if ($user && $user->role === 'student') {
            $approvedCohortIds = $user->enrollments()->where('status', 'approved')->pluck('cohort_id');
            return Event::whereIn('cohort_id', $approvedCohortIds)
                ->with('teacher')
                ->latest()
                ->get();
        }

        return Event::with('teacher')->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'type' => 'required|string',
            'date' => 'required|date',
            'time' => 'required',
            'location_url' => 'nullable|string',
            'details' => 'nullable|string',
            'agenda' => 'nullable|string',
            'learning_outcomes' => 'nullable|string',
            'itinerary' => 'nullable|string',
            'cohort_id' => 'required|exists:cohorts,id'
        ]);

        $event = $request->user()->hostedEvents()->create($validated);

        return response()->json($event, 201);
    }

    public function update(Request $request, $id)
    {
        $event = $request->user()->hostedEvents()->findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'type' => 'sometimes|required|string',
            'date' => 'sometimes|required|date',
            'time' => 'sometimes|required',
            'location_url' => 'nullable|string',
            'details' => 'nullable|string',
            'agenda' => 'nullable|string',
            'learning_outcomes' => 'nullable|string',
            'itinerary' => 'nullable|string'
        ]);

        $event->update($validated);

        return response()->json($event);
    }

    public function destroy(Request $request, $id)
    {
        $event = $request->user()->hostedEvents()->findOrFail($id);
        $event->delete();
        return response()->json(['message' => 'Event deleted']);
    }
}
