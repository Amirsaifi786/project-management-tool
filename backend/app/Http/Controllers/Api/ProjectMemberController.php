<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;

class ProjectMemberController extends Controller
{
    /**
     * Get project members
     */
    public function index(Project $project)
    {
        $members = $project->members()
            ->with('roles')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'message' => 'Project members fetched successfully',
            'data' => $members,
        ]);
    }

    /**
     * Add member to project
     */
    public function store(Request $request, Project $project)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'role' => 'nullable|string|max:100',
        ]);

        $user = User::findOrFail($validated['user_id']);

        // Check duplicate member
        if ($project->members()->where('user_id', $user->id)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'User is already a member of this project',
            ], 422);
        }

        $project->members()->attach($user->id, [
            'role' => $validated['role'] ?? null,
        ]);

        $project->load('members.roles');

        return response()->json([
            'success' => true,
            'message' => 'Project member added successfully',
            'data' => $project,
        ], 201);
    }

    /**
     * Update project member role
     */
    public function update(
        Request $request,
        Project $project,
        User $user
    ) {
        $validated = $request->validate([
            'role' => 'nullable|string|max:100',
        ]);

        if (!$project->members()->where('user_id', $user->id)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'User is not a member of this project',
            ], 404);
        }

        $project->members()->updateExistingPivot($user->id, [
            'role' => $validated['role'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Project member updated successfully',
        ]);
    }

    /**
     * Remove member
     */
    public function destroy(Project $project, User $user)
    {
        if (!$project->members()->where('user_id', $user->id)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'User is not a member of this project',
            ], 404);
        }

        $project->members()->detach($user->id);

        return response()->json([
            'success' => true,
            'message' => 'Project member removed successfully',
        ]);
    }
}