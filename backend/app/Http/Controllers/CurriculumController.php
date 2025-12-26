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
        // Simple store for now
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $curriculum = Curriculum::create($request->all());

        return response()->json($curriculum, 201);
    }
}
