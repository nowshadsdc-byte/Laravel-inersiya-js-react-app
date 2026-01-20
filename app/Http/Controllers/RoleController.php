<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $roles = Role::all()->map(function ($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
                'guard_name' => $role->guard_name,
                'permissions' => $role->permissions->pluck('name')->toArray(),
            ];
        });

        return inertia('role/index', [
            'roles' => $roles,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $permitons = Permission::all();
        return inertia('role/create', [
            'permissions' => $permitons
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:roles,name',
            'guard_name' => 'required',
            'permissions' => 'array'
        ]);
        $role = Role::create([
            'name' => $request->name,
            'guard_name' => $request->guard_name
        ]);
        if ($request->has('permissions')) {
            $role->syncPermissions($request->permissions);
        }
        return Inertia::location(route('users.permissions'));
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
       try {
            $role = Role::findById($id);

        } catch (\Exception $e) {
            $role = Role::findOrFail($id,'api');
        }
        $permissions = Permission::all();
        return Inertia::render('role/edit', [
            'role' => $role,
            'permissions' => $permissions,
            'rolePermitssions' => $role->permissions->pluck('id')->toArray(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        if ($request->name === 'admin') {
            return Inertia::location(route('users.permissions'));
        } else {
            $role = Role::findById($id);

            $request->validate([
                'name' => 'required|unique:roles,name,' . $id,
                'guard_name' => 'required',
                'permission_ids' => 'array'
            ]);
            $role->update([
                'name' => $request->name,
                'guard_name' => "web"
            ]);

            if ($request->filled('permission_ids')) {
                $permissions = Permission::whereIn('id', $request->permission_ids)
                    ->where('guard_name', $request->guard_name)
                    ->get();

                $role->syncPermissions($permissions);
            } else {
                $role->syncPermissions([]);
            }
            return Inertia::location(route('users.permissions'));
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $findRole = Role::findById($id, 'web');
        if ($findRole->name === 'admin') {
            return redirect()->back()->with('error', 'The admin role cannot be deleted.');  
        }   
        $findRole->delete();
        return redirect()->back()->with('success', 'Role deleted successfully.');

    }
}
