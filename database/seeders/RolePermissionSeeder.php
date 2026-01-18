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
            'view students',
            'create students',
            'edit students',
            'delete students',
            'view courses',
            'manage courses',
            'manage batches',
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
            'view students',
            'view courses',
            'manage batches',
        ]);

        $student->givePermissionTo([
            'view courses',
        ]);
        $teacher->givePermissionTo([
            'view students',
            'view courses',
        ]);
        $accounts->givePermissionTo([
            'view students',
            'view courses',
        ]);
        $editor->givePermissionTo([
            'view students',
            'create students',
            'edit students',
            'view courses',
        ]);
    }
}
