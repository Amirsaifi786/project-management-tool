<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Clear cached permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        /*
        |--------------------------------------------------------------------------
        | Permissions
        |--------------------------------------------------------------------------
        */

        $permissions = [

            // Users
            'view users',
            'create users',
            'edit users',
            'delete users',

            // Roles
            'view roles',
            'create roles',
            'edit roles',
            'delete roles',
            'assign roles',

            // Projects
            'view projects',
            'create projects',
            'edit projects',
            'delete projects',

            // Tasks
            'view tasks',
            'create tasks',
            'edit tasks',
            'delete tasks',
            'assign tasks',

            // Comments
            'view comments',
            'create comments',
            'edit comments',
            'delete comments',

            // Files
            'view files',
            'upload files',
            'delete files',

            // Reports
            'view reports',
            'create reports',

            // Settings
            'manage settings',

            'view project members',
            'add project members',
            'edit project members',
            'delete project members',
        ];

        foreach ($permissions as $permission) {

            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Roles
        |--------------------------------------------------------------------------
        */

        $admin = Role::firstOrCreate([
            'name' => 'Admin',
            'guard_name' => 'web',
        ]);

        $projectManager = Role::firstOrCreate([
            'name' => 'PM',
            'guard_name' => 'web',
        ]);

        $developer = Role::firstOrCreate([
            'name' => 'Developer',
            'guard_name' => 'web',
        ]);

        $qa = Role::firstOrCreate([
            'name' => 'QA',
            'guard_name' => 'web',
        ]);

        $client = Role::firstOrCreate([
            'name' => 'Client',
            'guard_name' => 'web',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Admin Permissions
        |--------------------------------------------------------------------------
        */

        $admin->syncPermissions(
            Permission::all()
        );


        $projectManager->syncPermissions([

            // Users
            'view users',

            // Roles
            'view roles',

            // Projects
            'view projects',
            'create projects',
            'edit projects',

            // Tasks
            'view tasks',
            'create tasks',
            'edit tasks',
            'assign tasks',

            // Comments
            'view comments',
            'create comments',
            'edit comments',

            // Files
            'view files',
            'upload files',

            // Reports
            'view reports',
            'create reports',
            'view projects',
            'create projects',
            'edit projects',
            'view project members',
            'add project members',
            'edit project members',
            'delete project members',



        ]);

        /*
        |--------------------------------------------------------------------------
        | Developer Permissions
        |--------------------------------------------------------------------------
        */

        $developer->syncPermissions([

            // Projects
            'view projects',

            // Tasks
            'view tasks',
            'create tasks',
            'edit tasks',

            // Comments
            'view comments',
            'create comments',
            'edit comments',

            // Files
            'view files',
            'upload files',
            'view projects',
            'view project members',
        ]);

        /*
        |--------------------------------------------------------------------------
        | QA Permissions
        |--------------------------------------------------------------------------
        */

        $qa->syncPermissions([

            // Projects
            'view projects',

            // Tasks
            'view tasks',
            'edit tasks',

            // Comments
            'view comments',
            'create comments',

            // Files
            'view files',

            // Reports
            'view reports',
            'view projects',
            'view project members',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Client Permissions
        |--------------------------------------------------------------------------
        */

        $client->syncPermissions([

            // Projects
            'view projects',

            // Tasks
            'view tasks',

            // Comments
            'view comments',
            'create comments',

            // Files
            'view files',

            // Reports
            'view reports',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Clear Permission Cache
        |--------------------------------------------------------------------------
        */

        app()[PermissionRegistrar::class]->forgetCachedPermissions();
    }
}
