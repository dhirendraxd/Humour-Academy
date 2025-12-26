<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Event;

class EventController extends Controller
{
    public function index()
    {
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
            'details' => 'nullable|string'
        ]);

        $event = $request->user()->hostedEvents()->create($validated);

        return response()->json($event, 201);
    }

    public function destroy(Request $request, $id)
    {
        $event = $request->user()->hostedEvents()->findOrFail($id);
        $event->delete();
        return response()->json(['message' => 'Event deleted']);
    }
}
