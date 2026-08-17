<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TaskController extends Controller
{
 public function index(Request $request)
{
    $query = Task::with([
        'project',
        'assignedUser'
    ]);

    if ($request->filled('project_id')) {
        $query->where(
            'project_id',
            $request->project_id
        );
    }

    return response()->json([
        'success' => true,
        'data' => $query->latest()->get()
    ]);
}


    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => [
                'required',
                'exists:projects,id',
            ],

            'title' => [
                'required',
                'string',
                'max:255',
            ],

            'description' => [
                'nullable',
                'string',
            ],

            'assigned_to' => [
                'nullable',
                'exists:users,id',
            ],

            'status' => [
                'nullable',
                Rule::in([
                    'todo',
                    'in_progress',
                    'review',
                    'completed',
                ]),
            ],

            'priority' => [
                'nullable',
                Rule::in([
                    'low',
                    'medium',
                    'high',
                    'urgent',
                ]),
            ],

            'start_date' => [
                'nullable',
                'date',
            ],

            'due_date' => [
                'nullable',
                'date',
                'after_or_equal:start_date',
            ],
        ]);

        $task = Task::create($validated);

        $task->load([
            'project:id,name',
            'assignee:id,name,email',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Task created successfully',
            'data' => $task,
        ], 201);
    }


    public function show(Task $task)
    {
        $task->load([
            'project:id,name',
            'assignee:id,name,email',
        ]);

        return response()->json([
            'success' => true,
            'data' => $task,
        ]);
    }


    public function update(
        Request $request,
        Task $task
    ) {
        $validated = $request->validate([
            'project_id' => [
                'required',
                'exists:projects,id',
            ],

            'title' => [
                'required',
                'string',
                'max:255',
            ],

            'description' => [
                'nullable',
                'string',
            ],

            'assigned_to' => [
                'nullable',
                'exists:users,id',
            ],

            'status' => [
                'required',
                Rule::in([
                    'todo',
                    'in_progress',
                    'review',
                    'completed',
                ]),
            ],

            'priority' => [
                'required',
                Rule::in([
                    'low',
                    'medium',
                    'high',
                    'urgent',
                ]),
            ],

            'start_date' => [
                'nullable',
                'date',
            ],

            'due_date' => [
                'nullable',
                'date',
                'after_or_equal:start_date',
            ],
        ]);

        $task->update($validated);

        $task->load([
            'project:id,name',
            'assignee:id,name,email',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Task updated successfully',
            'data' => $task,
        ]);
    }


    public function destroy(Task $task)
    {
        $task->delete();

        return response()->json([
            'success' => true,
            'message' => 'Task deleted successfully',
        ]);
    }
}