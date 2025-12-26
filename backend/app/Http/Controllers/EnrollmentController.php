<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    // Apply for a course (Student)
    public function store(Request $request)
    {
        $request->validate(['course_id' => 'required|exists:courses,id']);

        $exists = Enrollment::where('student_id', $request->user()->id)
            ->where('course_id', $request->course_id)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Already enrolled'], 400);
        }

        Enrollment::create([
            'student_id' => $request->user()->id,
            'course_id' => $request->course_id,
            'status' => 'pending'
        ]);

        return response()->json(['message' => 'Application sent']);
    }

    // List requests for teacher's courses (Teacher)
    public function index(Request $request)
    {
        $teacherId = $request->user()->id;

        $enrollments = Enrollment::whereHas('course', function ($q) use ($teacherId) {
            $q->where('teacher_id', $teacherId);
        })
            ->with(['student:id,name,email,bio', 'course:id,title'])
            ->where('status', 'pending')
            ->get();

        return response()->json($enrollments);
    }

    // Approve/Reject enrollment (Teacher)
    public function update(Request $request, $id)
    {
        $request->validate(['status' => 'required|in:approved,rejected']);

        $enrollment = Enrollment::findOrFail($id);

        // Verify course belongs to teacher
        if ($enrollment->course->teacher_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $enrollment->update(['status' => $request->status]);

        return response()->json(['message' => 'Status updated']);
    }
}
