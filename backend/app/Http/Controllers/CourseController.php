<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    // List all courses with teacher info
    public function index()
    {
        return response()->json(
            Course::with('teacher:id,name,rank,bio')->get()
        );
    }

    // Create a new course (Teacher only)
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $course = $request->user()->courses()->create([
            'title' => $request->title,
            'description' => $request->description,
        ]);

        return response()->json($course, 201);
    }
}
