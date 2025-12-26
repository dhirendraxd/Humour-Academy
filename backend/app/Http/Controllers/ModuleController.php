<?php

namespace App\Http\Controllers;

use App\Models\Module;
use Illuminate\Http\Request;

class ModuleController extends Controller
{
    public function index(Request $request)
    {
        $query = Module::with(['teacher:id,name,rank,bio', 'curriculum']);

        if ($request->has('curriculum_id')) {
            $query->where('curriculum_id', $request->curriculum_id);
        }

        return response()->json($query->orderBy('order_index')->get());
    }

    public function store(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'bod') {
            return response()->json(['message' => 'Unauthorized. Only BOD can create modules.'], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'curriculum_id' => 'required|exists:curriculums,id',
            'teacher_id' => 'required|exists:users,id',
            'order_index' => 'nullable|integer',
            'duration_months' => 'nullable|integer',
        ]);

        $module = Module::create($request->all());

        return response()->json($module, 201);
    }

    public function show($id)
    {
        return Module::with(['teacher', 'curriculum', 'cohorts'])->findOrFail($id);
    }
}
