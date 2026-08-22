<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $user = auth()->user();

        $totalUsers = User::count();

        $totalProjects = Project::count();

        $totalTasks = Task::count();

        $completedTasks = Task::where(
            'status',
            'completed'
        )->count();

        $pendingTasks = Task::where(
            'status',
            'pending'
        )->count();

        $inProgressTasks = Task::where(
            'status',
            'in_progress'
        )->count();

        $cancelledTasks = Task::where(
            'status',
            'cancelled'
        )->count();

        $myTasks = Task::where(
            'assigned_to',
            $user->id
        )->count();

        $overdueTasks = Task::whereDate(
            'due_date',
            '<',
            now()->toDateString()
        )
        ->whereNotIn('status', [
            'completed',
            'cancelled'
        ])
        ->count();

        $recentProjects = Project::latest()
            ->take(5)
            ->get([
                'id',
                'name',
                'status',
                'priority',
                'start_date',
                'end_date',
                'created_at',
            ]);

        $recentTasks = Task::with([
            'project:id,name',
            'assignee:id,name'
        ])
        ->latest()
        ->take(5)
        ->get([
            'id',
            'project_id',
            'title',
            'assigned_to',
            'status',
            'priority',
            'due_date',
            'created_at',
        ]);

        return response()->json([
            'success' => true,

            'data' => [

                'stats' => [
                    'total_users' => $totalUsers,
                    'total_projects' => $totalProjects,
                    'total_tasks' => $totalTasks,
                    'completed_tasks' => $completedTasks,
                    'pending_tasks' => $pendingTasks,
                    'in_progress_tasks' => $inProgressTasks,
                    'cancelled_tasks' => $cancelledTasks,
                    'my_tasks' => $myTasks,
                    'overdue_tasks' => $overdueTasks,
                ],

                'recent_projects' => $recentProjects,

                'recent_tasks' => $recentTasks,
            ],
        ]);
    }
}