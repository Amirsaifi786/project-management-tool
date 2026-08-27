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
           $query->each(function ($query) {
                $query->append('deadline_status');
            });


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


public function update(Request $request, Task $task)
{
    $validated = $request->validate([
        'title' => ['sometimes', 'string', 'max:255'],
        'description' => ['nullable', 'string'],
        'assigned_to' => ['nullable', 'exists:users,id'],
        'status' => [
            'sometimes',
            'string',
            'in:todo,in_progress,review,completed,blocked,cancelled'
        ],
        'priority' => [
            'sometimes',
            'string',
            'in:low,medium,high,urgent'
        ],
        'start_date' => ['nullable', 'date'],
        'due_date' => ['nullable', 'date'],
    ]);

    $oldStatus = $task->status;
    $oldPriority = $task->priority;
    $oldDueDate = $task->due_date?->format('Y-m-d');

    $task->update($validated);

    if (
        array_key_exists('status', $validated) &&
        $oldStatus !== $task->status
    ) {
        $task->activities()->create([
            'user_id' => auth()->id(),
            'action' => 'status_changed',
            'description' => 'changed task status',
            'old_value' => $oldStatus,
            'new_value' => $task->status,
        ]);
    }

    if (
        array_key_exists('priority', $validated) &&
        $oldPriority !== $task->priority
    ) {
        $task->activities()->create([
            'user_id' => auth()->id(),
            'action' => 'priority_changed',
            'description' => 'changed task priority',
            'old_value' => $oldPriority,
            'new_value' => $task->priority,
        ]);
    }

    $newDueDate = $task->due_date?->format('Y-m-d');

    if (
        array_key_exists('due_date', $validated) &&
        $oldDueDate !== $newDueDate
    ) {
        $task->activities()->create([
            'user_id' => auth()->id(),
            'action' => 'due_date_changed',
            'description' => 'changed task due date',
            'old_value' => $oldDueDate,
            'new_value' => $newDueDate,
        ]);
    }

    $task->load([
        'project',
        'assignedUser:id,name,email',
        'comments.user:id,name,email',
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Task updated successfully.',
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
