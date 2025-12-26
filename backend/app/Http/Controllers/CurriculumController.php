<?php

namespace App\Http\Controllers;

use App\Models\Curriculum;
use Illuminate\Http\Request;

class CurriculumController extends Controller
{
    public function index()
    {
        return Curriculum::with('modules.teacher')->get();
    }

    public function store(Request $request)
    {
        if ($request->user()->role !== 'bod') {
            return response()->json(['message' => 'Unauthorized. Only BOD can create curriculums.'], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'outcomes' => 'nullable|string',
            'prerequisites' => 'nullable|string',
        ]);

        $curriculum = Curriculum::create($request->all());

        return response()->json($curriculum, 201);
    }
}
