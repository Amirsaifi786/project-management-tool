<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TaskComment;
use Illuminate\Http\Request;

class TaskCommentController extends Controller
{
    public function index(Task $task)
    {
        $comments = $task->comments()
            ->with('user:id,name,email')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Comments fetched successfully',
            'data' => $comments,
        ]);
    }

    public function store(Request $request, Task $task)
    {
        $validated = $request->validate([
            'comment' => ['required', 'string', 'max:5000'],
        ]);

        $comment = $task->comments()->create([
            'user_id' => $request->user()->id,
            'comment' => $validated['comment'],
        ]);

        $task->activities()->create([
            'user_id' => $request->user()->id,
            'action' => 'comment_added',
            'description' => 'added a comment',
            'new_value' => $validated['comment'],
        ]);

        $comment->load('user:id,name,email');

        return response()->json([
            'success' => true,
            'message' => 'Comment added successfully',
            'data' => $comment,
        ], 201);
    }

    public function update(Request $request, TaskComment $comment)
    {
        if ($comment->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'You are not authorized to update this comment',
            ], 403);
        }

        $validated = $request->validate([
            'comment' => ['required', 'string', 'max:5000'],
        ]);

        $oldComment = $comment->comment;

        $comment->update([
            'comment' => $validated['comment'],
        ]);

        $comment->load('user:id,name,email');

        $comment->task->activities()->create([
            'user_id' => $request->user()->id,
            'action' => 'comment_updated',
            'description' => 'updated a comment',
            'old_value' => $oldComment,
            'new_value' => $validated['comment'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Comment updated successfully',
            'data' => $comment,
        ]);
    }

    public function destroy(Request $request, TaskComment $comment)
    {
        if ($comment->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'You are not authorized to delete this comment',
            ], 403);
        }

        $task = $comment->task;
        $oldComment = $comment->comment;

        $task->activities()->create([
            'user_id' => $request->user()->id,
            'action' => 'comment_deleted',
            'description' => 'deleted a comment',
            'old_value' => $oldComment,
        ]);

        $comment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Comment deleted successfully',
        ]);
    }
}