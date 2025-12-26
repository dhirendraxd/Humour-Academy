<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Material;

class MaterialController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->materials()->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'file_url' => 'nullable|string',
            'learning_objectives' => 'nullable|array',
            'prerequisites' => 'nullable|string',
            'estimated_study_time' => 'nullable|string',
            'resource_type' => 'nullable|string',
            'module_breakdown' => 'nullable|string',
        ]);

        $material = $request->user()->materials()->create($validated);

        return response()->json($material, 201);
    }

    public function update(Request $request, $id)
    {
        $material = $request->user()->materials()->findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'file_url' => 'nullable|string',
            'learning_objectives' => 'nullable|array',
            'prerequisites' => 'nullable|string',
            'estimated_study_time' => 'nullable|string',
            'resource_type' => 'nullable|string',
            'module_breakdown' => 'nullable|string',
        ]);

        $material->update($validated);

        return response()->json($material);
    }

    public function destroy(Request $request, $id)
    {
        $material = $request->user()->materials()->findOrFail($id);
        $material->delete();
        return response()->json(['message' => 'Material deleted']);
    }
}
