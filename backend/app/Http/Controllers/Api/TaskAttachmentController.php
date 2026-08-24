<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class TaskAttachmentController extends Controller
{
    public function store(Request $request, Task $task)
    {
        $request->validate([
            'files' => ['required', 'array', 'min:1'],
            'files.*' => [
                'required',
                'file',
                'max:10240',
                'mimes:jpg,jpeg,png,gif,webp,pdf,doc,docx,xls,xlsx,ppt,pptx,txt,csv,zip'
            ],
        ]);

        $attachments = $task->attachments ?? [];

        foreach ($request->file('files') as $file) {
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();

            $path = $file->storeAs(
                'task-attachments/' . $task->id,
                $filename,
                'public'
            );

            $attachments[] = [
                'id' => (string) Str::uuid(),
                'name' => $file->getClientOriginalName(),
                'filename' => $filename,
                'path' => $path,
                'type' => $file->getClientMimeType(),
                'extension' => strtolower($file->getClientOriginalExtension()),
                'size' => $file->getSize(),
                'uploaded_by' => auth()->d(),
                'uploaded_at' => now()->toDateTimeString(),
            ];
        }

        $task->attachments = $attachments;
        $task->save();

        return response()->json([
            'success' => true,
            'message' => 'Files uploaded successfully.',
            'attachments' => $task->attachments,
        ]);
    }

    public function index(Task $task)
    {
        return response()->json([
            'success' => true,
            'attachments' => $task->attachments ?? [],
        ]);
    }

public function download(Task $task, string $attachment)
{
    $attachments = $task->attachments ?? [];

    $file = collect($attachments)->firstWhere('id', $attachment);

    if (!$file) {
        return response()->json([
            'success' => false,
            'message' => 'Attachment not found.'
        ], 404);
    }

    if (
        !isset($file['path']) ||
        !Storage::disk('public')->exists($file['path'])
    ) {
        return response()->json([
            'success' => false,
            'message' => 'File does not exist.'
        ], 404);
    }

    $path = Storage::disk('public')->path($file['path']);

    $mimeType = $file['type'] ?? mime_content_type($path);

    return response()->file($path, [
        'Content-Type' => $mimeType,
        'Content-Disposition' => 'inline; filename="' . $file['name'] . '"',
    ]);
}

    public function destroy(Task $task, string $attachment)
    {
        $attachments = $task->attachments ?? [];

        $index = collect($attachments)->search(
            fn ($item) => isset($item['id']) && $item['id'] === $attachment
        );

        if ($index === false) {
            return response()->json([
                'success' => false,
                'message' => 'Attachment not found.'
            ], 404);
        }

        $file = $attachments[$index];

        if (
            isset($file['path']) &&
            Storage::disk('public')->exists($file['path'])
        ) {
            Storage::disk('public')->delete($file['path']);
        }

        unset($attachments[$index]);

        $task->attachments = array_values($attachments);
        $task->save();

        return response()->json([
            'success' => true,
            'message' => 'Attachment deleted successfully.',
            'attachments' => $task->attachments,
        ]);
    }
}