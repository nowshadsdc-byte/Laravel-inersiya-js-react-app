<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $permissions = [
            'view_students',
            'create_students',
            'edit_students',
            'delete_students',

            'view_courses',
            'create_courses',
            'edit_courses',
            'delete_courses',

            'view_batches',
            'create_batches',
            'edit_batches',
            'delete_batches',
      
            'view_users',
            'create_users',
            'edit_users',
            'delete_users',

            'view_roles',
            'create_roles',
            'edit_roles',
            'delete_roles',

            'view_permissions',
            'create_permissions',
            'edit_permissions',
            'delete_permissions',

            'view_leads',
            'create_leads',
            'edit_leads',
            'delete_leads',

            'view_billing',
            'create_billing',
            'edit_billing',
            'delete_billing',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        $admin = Role::create(['name' => 'admin']);
        $user  = Role::create(['name' => 'user']);
        $accounts = Role::create(['name' => 'accounts']);
        $teacher = Role::create(['name' => 'teacher']);
        $student = Role::create(['name' => 'student']);
        $editor = Role::create(['name' => 'editor']);

        $admin->givePermissionTo(Permission::all());

        $user->givePermissionTo([
            'view_students',
            'view_courses',
            'view_batches',
        ]);

        $student->givePermissionTo([
            'view_students',
            'view_courses',
            'view_batches',
        ]);
        $teacher->givePermissionTo([
            'view_students',
            'view_courses',
            'view_batches',
        ]);
        $accounts->givePermissionTo([
            'view_students',
            'view_courses',
            'view_batches',
        ]);
        $editor->givePermissionTo([
            'view_students',
            'create_students',
            'edit_students',
            'view_courses',
            'view_batches',
        ]);
    }
}
