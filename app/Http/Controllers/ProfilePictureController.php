<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\User;

class ProfilePictureController extends Controller
{
    public function __invoke(Request $request)
    {
        $user = Auth::user();
        if (! $user instanceof User) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $validated = $request->validate([
            'picture' => ['required', 'image', 'max:2048'],
        ]);

        $file = $request->file('picture');
        $path = $file->store('profile_pictures', 'public');

        // Optionally delete old picture
        if ($user->profile_picture && Storage::disk('public')->exists($user->profile_picture)) {
            Storage::disk('public')->delete($user->profile_picture);
        }

        $user->profile_picture = $path;
        $user->save();

        return response()->json([
            'message' => 'Profile picture uploaded.',
            'url' => Storage::url($path),
        ], 200);
    }
}
