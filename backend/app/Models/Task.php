<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'title',
        'description',
        'assigned_to',
        'status',
        'priority',
        'start_date',
        'due_date',
                'attachments',
    ];

    protected $casts = [
        'start_date' => 'date',
        'due_date' => 'date',
        'attachments' => 'array',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
     public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
    public function comments()
{
    return $this->hasMany(TaskComment::class);
}
public function activities()
{
    return $this->hasMany(TaskActivity::class);
}
public function getDeadlineStatusAttribute()
{
    if (!$this->due_date) {
        return 'no_due_date';
    }

    $today = now()->startOfDay();
    $dueDate = $this->due_date->startOfDay();

    if ($dueDate->lt($today) && !in_array(strtolower($this->status), ['completed', 'done'])) {
        return 'overdue';
    }

    if ($dueDate->equalTo($today)) {
        return 'due_today';
    }

    if ($dueDate->lte($today->copy()->addDays(3))) {
        return 'due_soon';
    }

    return 'on_track';
}
}