<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules\In;
use Inertia\Inertia;

use function Termwind\render;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $courses = Course::latest()->get();
        return Inertia::render('course/index', compact('courses'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('course/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'course_code' => 'required|string',
            'description' => 'nullable|string',
        ]);
        $result = Course::create($validated);
        return redirect()->route('courses.index')->with('success', 'Batch created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Course $course)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Course $id)
    {
        dd($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Course $id)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'course_code' => ['required', 'string'],
            'description' => ['nullable', 'string'],
        ]);

        $course = Course::findOrFail($id->id);
        $course->update($validated);
        return redirect()->back()->with('success', 'course updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Course $id)
    {
        $id->delete();
        return redirect()->route('courses.index')->with('success', 'Course deleted successfully.');
    }
}
