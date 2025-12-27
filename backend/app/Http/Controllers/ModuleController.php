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

    public function update(Request $request, $id)
    {
        $user = $request->user();
        if ($user->role !== 'bod') {
            return response()->json(['message' => 'Unauthorized. Only BOD can update modules.'], 403);
        }

        $module = Module::findOrFail($id);
        $oldTeacherId = $module->teacher_id;

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'teacher_id' => 'sometimes|required|exists:users,id',
            'duration_months' => 'nullable|integer',
        ]);

        $module->update($request->all());

        // Notify new teacher if changed
        if ($request->has('teacher_id') && $module->teacher_id != $oldTeacherId) {
            \App\Models\Notification::create([
                'user_id' => $module->teacher_id,
                'title' => 'New Module Assignment',
                'message' => "You have been assigned as the architect for module: {$module->title}",
                'type' => 'info',
                'is_read' => false
            ]);
        }

        return response()->json($module);
    }
}
