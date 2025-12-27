<?php

namespace App\Http\Controllers;

use App\Models\Module;
use App\Models\Notification;
use App\Traits\ApiResponse;
use App\Traits\SanitizesInput;
use Illuminate\Http\Request;

class ModuleController extends Controller
{
    use ApiResponse, SanitizesInput;

    public function index(Request $request)
    {
        $query = Module::with(['teacher:id,name,rank,bio', 'curriculum']);

        if ($request->has('curriculum_id')) {
            $query->where('curriculum_id', $request->curriculum_id);
        }

        if ($request->search) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        $modules = $query->orderBy('order_index')->paginate(15);
        return $this->successWithPagination($modules, 'Modules retrieved successfully');
    }

    public function store(Request $request)
    {
        $this->authorize('create', Module::class);

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'curriculum_id' => 'required|exists:curriculums,id',
            'teacher_id' => 'required|exists:users,id',
            'order_index' => 'nullable|integer',
            'duration_months' => 'nullable|integer',
        ]);
    
    $data = $this->sanitizeArray($request->all(), ['title', 'description']);
    $module = Module::create($data);

        return $this->success($module, 'Module created successfully', 201);
    }

    public function show($id)
    {
        $module = Module::with(['teacher', 'curriculum', 'cohorts'])->findOrFail($id);
        return $this->success($module, 'Module retrieved successfully');
    }

    public function update(Request $request, $id)
    {
        $module = Module::findOrFail($id);
        $this->authorize('update', $module);

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
            Notification::create([
                'user_id' => $module->teacher_id,
                'title' => 'New Module Assignment',
                'message' => "You have been assigned as the architect for module: {$module->title}",
                'type' => 'info',
                'is_read' => false
            ]);
        }

        return $this->success($module, 'Module updated successfully');
    }

    public function destroy($id)
    {
        $module = Module::findOrFail($id);
        $this->authorize('delete', $module);

        $module->delete();
        return $this->success(null, 'Module deleted successfully');
    }
}
