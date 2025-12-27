<?php

namespace App\Http\Controllers;

use App\Models\Curriculum;
use App\Traits\ApiResponse;
use App\Traits\SanitizesInput;
use Illuminate\Http\Request;

class CurriculumController extends Controller
{
    use ApiResponse, SanitizesInput;

    public function index(Request $request)
    {
        $query = Curriculum::with('modules.teacher');

        if ($request->search) {
            $query->where('title', 'like', "%{$request->search}%")
                  ->orWhere('description', 'like', "%{$request->search}%");
        }

        $curriculums = $query->paginate(15);
        return $this->successWithPagination($curriculums, 'Curriculums retrieved successfully');
    }

    public function store(Request $request)
    {
        $this->authorize('create', Curriculum::class);

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'outcomes' => 'nullable|string',
            'prerequisites' => 'nullable|string',
        ]);
    
    $data = $this->sanitizeArray($request->all(), ['title', 'description', 'outcomes', 'prerequisites']);
    $curriculum = Curriculum::create($data);

        return $this->success($curriculum, 'Curriculum created successfully', 201);
    }

    public function show($id)
    {
        $curriculum = Curriculum::with('modules.teacher')->findOrFail($id);
        return $this->success($curriculum, 'Curriculum retrieved successfully');
    }

    public function update(Request $request, $id)
    {
        $curriculum = Curriculum::findOrFail($id);
        $this->authorize('update', $curriculum);

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'outcomes' => 'nullable|string',
            'prerequisites' => 'nullable|string',
        ]);
    
    $data = $this->sanitizeArray($request->all(), ['title', 'description', 'outcomes', 'prerequisites']);
    $curriculum->update($data);
        return $this->success($curriculum, 'Curriculum updated successfully');
    }

    public function destroy($id)
    {
        $curriculum = Curriculum::findOrFail($id);
        $this->authorize('delete', $curriculum);

        $curriculum->delete();
        return $this->success(null, 'Curriculum deleted successfully');
    }
}
