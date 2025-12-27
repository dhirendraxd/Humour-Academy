<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class FacultyController extends Controller
{
    public function index()
    {
        return User::whereIn('role', ['faculty', 'bod', 'student'])
            ->select('id', 'name', 'role', 'rank', 'bio', 'level', 'city', 'interests')
            ->get();
    }
}
