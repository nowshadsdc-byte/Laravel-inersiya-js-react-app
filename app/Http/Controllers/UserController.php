<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::all()->load('roles');
        return Inertia::render('user/index', [
            'users' => $users
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
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
        $user = User::findOrFail($id);
        $rols = Role::all();
        $roleId = $user->roles->pluck('id')->toArray();
        
        return Inertia::render('user/edit', [
            'user' => $user,
            'roles' => $rols,
            'assignedRoles' => $roleId,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);
        $request = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'roles' => 'array',
            'roles.*' => 'exists:roles,id',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);
        // Handle profile picture upload if provided
        if (isset($request['profile_picture'])) {
            $path = $request['profile_picture']->store('profile_pictures', 'public');
            $user->profile_picture = $path;
        }
        
        $user->update([
            'name' => $request['name'],
            'email' => $request['email'],
        ]);

        // Sync roles
        $user->roles()->sync($request['roles'] ?? []);

        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
