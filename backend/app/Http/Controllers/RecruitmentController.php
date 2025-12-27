<?php

namespace App\Http\Controllers;

use App\Models\TeacherApplication;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RecruitmentController extends Controller
{
    public function index()
    {
        // Only BOD can see applications
        if (Auth::user()->role !== 'bod') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return TeacherApplication::with('user')->orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'specialization' => 'required|string',
            'experience_summary' => 'required|string',
            'resume_link' => 'nullable|string'
        ]);

        $application = TeacherApplication::create([
            'user_id' => Auth::id(),
            'specialization' => $request->specialization,
            'experience_summary' => $request->experience_summary,
            'resume_link' => $request->resume_link,
            'status' => 'pending'
        ]);

        return response()->json($application, 201);
    }

    public function update(Request $request, $id)
    {
        // Only BOD can update status
        if (Auth::user()->role !== 'bod') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'status' => 'required|in:approved,rejected',
            'bod_notes' => 'nullable|string'
        ]);

        $application = TeacherApplication::findOrFail($id);
        $application->update([
            'status' => $request->status,
            'bod_notes' => $request->bod_notes
        ]);

        if ($request->status === 'approved') {
            $user = $application->user;
            $user->update(['role' => 'faculty']);
        }

        return response()->json($application);
    }
}
