<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\ProjectMemberController;
use App\Http\Controllers\Api\TaskController;
Route::prefix('auth')->group(function () {

    Route::post('/register', [AuthController::class, 'register']);

    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {

        Route::get('/user', [AuthController::class, 'user']);

        Route::post('/logout', [AuthController::class, 'logout']);
    });
});


/*
|--------------------------------------------------------------------------
| Users API
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {
    // Users
    Route::get('/users', [UserController::class, 'index'])
        ->middleware('can:view users');

    Route::post('/users', [UserController::class, 'store'])
        ->middleware('can:create users');

    Route::get('/users/{user}', [UserController::class, 'show'])
        ->middleware('can:view users');

    Route::put('/users/{user}', [UserController::class, 'update'])
        ->middleware('can:edit users');

    Route::delete('/users/{user}', [UserController::class, 'destroy'])
        ->middleware('can:delete users');

    // Assign Role
    Route::post('/users/{user}/role', [UserController::class, 'assignRole'])
        ->middleware('can:assign roles');

    // Remove Role
    Route::delete('/users/{user}/role', [UserController::class, 'removeRole'])
        ->middleware('can:assign roles');

    Route::get('/projects', [ProjectController::class, 'index'])
        ->middleware('can:view projects');

    Route::post('/projects', [ProjectController::class, 'store'])
        ->middleware('can:create projects');

    Route::get('/projects/{project}', [ProjectController::class, 'show'])
        ->middleware('can:view projects');

    Route::put('/projects/{project}', [ProjectController::class, 'update'])
        ->middleware('can:edit projects');

    Route::delete('/projects/{project}', [ProjectController::class, 'destroy'])
        ->middleware('can:delete projects');
                /*
            |--------------------------------------------------------------------------
            | Project Members
            |--------------------------------------------------------------------------
            */

    Route::get(
        '/projects/{project}/members',
        [ProjectMemberController::class, 'index']
    )->middleware('can:view project members');

    Route::post(
        '/projects/{project}/members',
        [ProjectMemberController::class, 'store']
    )->middleware('can:add project members');

    Route::put(
        '/projects/{project}/members/{user}',
        [ProjectMemberController::class, 'update']
    )->middleware('can:edit project members');

    Route::delete(
        '/projects/{project}/members/{user}',
        [ProjectMemberController::class, 'destroy']
    )->middleware('can:delete project members');

    Route::get('/tasks', [
    TaskController::class,
    'index'
])->middleware('can:view tasks');

Route::post('/tasks', [
    TaskController::class,
    'store'
])->middleware('can:create tasks');

Route::get('/tasks/{task}', [
    TaskController::class,
    'show'
])->middleware('can:view tasks');

Route::put('/tasks/{task}', [
    TaskController::class,
    'update'
])->middleware('can:edit tasks');

Route::delete('/tasks/{task}', [
    TaskController::class,
    'destroy'
])->middleware('can:delete tasks');
});
