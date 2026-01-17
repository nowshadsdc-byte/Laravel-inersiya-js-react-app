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

        $admin = Role::firstOrCreate(['name' => 'Admin']);
        $teacher = Role::firstOrCreate(['name' => 'Teacher']);
        $student = Role::firstOrCreate(['name' => 'Student']);

        $admin->givePermissionTo(Permission::all());

        $teacher->givePermissionTo([
            'view students',
            'view courses',
            'manage batches',
        ]);

        $student->givePermissionTo([
            'view courses',
        ]);
    }
}
