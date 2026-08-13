<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
class UserController extends Controller
{
    /**
     * Get all users
     */
    public function index()
    {
        $users = User::with('roles')
            ->latest()
            ->paginate(10);

        return response()->json([
            'success' => true,
            'message' => 'Users fetched successfully',
            'data' => $users
        ]);
    }

    /**
     * Create user
     */
    // public function store(Request $request)
    // {
    //     $validated = $request->validate([
    //         'name' => 'required|string|max:255',

    //         'email' => [
    //             'required',
    //             'email',
    //             'max:255',
    //             'unique:users,email',
    //         ],

    //         'password' => 'required|string|min:8|confirmed',

    //         'role' => 'nullable|string|exists:roles,name',
    //     ]);

    //     $user = User::create([
    //         'name' => $validated['name'],
    //         'email' => $validated['email'],
    //         'password' => Hash::make($validated['password']),
    //     ]);

    //     // Assign role if provided
    //     if (!empty($validated['role'])) {
    //         $user->assignRole($validated['role']);
    //     }

    //     $user->load('roles');

    //     return response()->json([
    //         'success' => true,
    //         'message' => 'User created successfully',
    //         'data' => $user,
    //     ], 201);
    // }
public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email',
        'password' => 'required|string|min:8|confirmed',
        'role' => 'nullable|string|exists:roles,name',
    ]);

    $user = User::create([
        'name' => $validated['name'],
        'email' => $validated['email'],
        'password' => Hash::make($validated['password']),
    ]);

    if (!empty($validated['role'])) {
        $user->assignRole($validated['role']);
    }

    return response()->json([
        'success' => true,
        'message' => 'User created successfully',
        'data' => $user->load('roles'),
    ], 201);
}
    /**
     * Get single user
     */
    public function show(User $user)
    {
        $user->load('roles', 'permissions');

        return response()->json([
            'success' => true,
            'message' => 'User fetched successfully',
            'data' => $user,
        ]);
    }

    /**
     * Update user
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',

            'email' => [
                'sometimes',
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],

            'password' => 'nullable|string|min:8|confirmed',
        ]);

        if (isset($validated['name'])) {
            $user->name = $validated['name'];
        }

        if (isset($validated['email'])) {
            $user->email = $validated['email'];
        }

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        $user->load('roles');

        return response()->json([
            'success' => true,
            'message' => 'User updated successfully',
            'data' => $user,
        ]);
    }

    /**
     * Delete user
     */
    public function destroy(User $user)
    {
        // Prevent deleting yourself
        if (auth()->id() === $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot delete your own account',
            ], 422);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully',
        ]);
    }

    /**
     * Assign role to user
     */
    public function assignRole(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => 'required|string|exists:roles,name',
        ]);

        // Replace existing roles with selected role
        $user->syncRoles([$validated['role']]);

        $user->load('roles');

        return response()->json([
            'success' => true,
            'message' => 'Role assigned successfully',
            'data' => $user,
        ]);
    }

    /**
     * Remove role from user
     */
    public function removeRole(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => 'required|string|exists:roles,name',
        ]);

        $user->removeRole($validated['role']);

        $user->load('roles');

        return response()->json([
            'success' => true,
            'message' => 'Role removed successfully',
            'data' => $user,
        ]);
    }
}