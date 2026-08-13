<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ProjectController extends Controller
{
    /**
     * Get all projects
     */
    public function index(Request $request)
    {
        $projects = Project::with('creator:id,name,email')
            ->latest()
            ->paginate(10);

        return response()->json([
            'success' => true,
            'message' => 'Projects fetched successfully',
            'data' => $projects,
        ]);
    }


    /**
     * Create project
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',

            'description' => 'nullable|string',

            'status' => [
                'nullable',
                Rule::in([
                    'active',
                    'completed',
                    'on_hold',
                    'cancelled',
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

            'start_date' => 'nullable|date',

            'end_date' => [
                'nullable',
                'date',
                'after_or_equal:start_date',
            ],
        ]);

        $project = Project::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'status' => $validated['status'] ?? 'active',
            'priority' => $validated['priority'] ?? 'medium',
            'start_date' => $validated['start_date'] ?? null,
            'end_date' => $validated['end_date'] ?? null,
            'created_by' => Auth::id(),
        ]);

        $project->load('creator:id,name,email');

        return response()->json([
            'success' => true,
            'message' => 'Project created successfully',
            'data' => $project,
        ], 201);
    }


    /**
     * Get single project
     */
    public function show(Project $project)
    {
        $project->load('creator:id,name,email');

        return response()->json([
            'success' => true,
            'message' => 'Project fetched successfully',
            'data' => $project,
        ]);
    }


    /**
     * Update project
     */
    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',

            'description' => 'nullable|string',

            'status' => [
                'sometimes',
                Rule::in([
                    'active',
                    'completed',
                    'on_hold',
                    'cancelled',
                ]),
            ],

            'priority' => [
                'sometimes',
                Rule::in([
                    'low',
                    'medium',
                    'high',
                    'urgent',
                ]),
            ],

            'start_date' => 'nullable|date',

            'end_date' => [
                'nullable',
                'date',
                'after_or_equal:start_date',
            ],
        ]);

        $project->update($validated);

        $project->load('creator:id,name,email');

        return response()->json([
            'success' => true,
            'message' => 'Project updated successfully',
            'data' => $project,
        ]);
    }


    /**
     * Delete project
     */
    public function destroy(Project $project)
    {
        $project->delete();

        return response()->json([
            'success' => true,
            'message' => 'Project deleted successfully',
        ]);
    }
}