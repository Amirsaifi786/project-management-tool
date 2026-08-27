<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskActivityController extends Controller
{
    public function index(Task $task)
    {
        $activities = $task->activities()
            ->with('user:id,name')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Task activities fetched successfully.',
            'data' => $activities,
        ]);
    }
}