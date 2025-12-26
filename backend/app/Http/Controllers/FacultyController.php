<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class FacultyController extends Controller
{
    public function index()
    {
        return User::where('role', 'faculty')
            ->select('id', 'name', 'rank', 'bio')
            ->get();
    }
}
