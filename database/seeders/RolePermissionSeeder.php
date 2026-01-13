<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $role = Role::create([
            'name' => 'admin'
        ]);
        $permissions = [
            ['name' => 'Student Create'],
            ['name' => 'Create Student'],
            ['name' => 'Edit Student'],
            ['name' => 'Delete Student'],
            ['name' => 'Student Create'],
            ['name' => 'Create Student'],
            ['name' => 'Edit Student'],
            ['name' => 'Delete Student'],
        ];
        foreach ($permissions as $item) {
            Permission::create($item);
        };
        $user = User::fast();
        $user->assignRole('admin');
    }
}
