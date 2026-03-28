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
        // $courses = Course::latest()->get();
        $courses = Course::withCount('students')->get()->map(function ($course) {
            return [
                'id' => $course->id,
                'name' => $course->name,
                'course_code' => $course->course_code,
                'description' => $course->description,
                'students_count' => $course->students_count,
            ];
        });
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
            'name' => ['required', 'string', 'max:255'],
            'course_code' => ['nullable', 'string', 'unique:courses,course_code'],
            'description' => ['nullable', 'string'],
        ],
        [
            'name.required' => 'The course name is required.',
            'name.string' => 'The course name must be a string.',
            'name.max' => 'The course name may not be greater than 255 characters.',
            'course_code.string' => 'The course code must be a string.',
            'course_code.unique' => 'The course code has already been taken. Please choose a different course code.',
            'description.string' => 'The description must be a string.',
        ]);

        if (Course::where('course_code', $validated['course_code'])->exists()) {
            return redirect()->back()->withErrors('A course with this course code already exists. Please choose a different course code.');
        }
        if (Course::where('name', $validated['name'])->exists()) {
            return redirect()->back()->withErrors('A course with this name already exists. Please choose a different name.');
        }
        $courseCreted = Course::create($validated);

        if (!$courseCreted) {
            return redirect()->back()->withErrors('Failed to create the course. Please try again.');
        }
        return redirect()->route('courses.index')->with('success', 'Course created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Course $id)
    {
        $courseData = Course::with('batch')->findOrFail($id->id);
        return Inertia::render('course/showCours', [
            'course' => $courseData
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Course $id)
    {
        // dd($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Course $id)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'course_code' => ['nullable', 'string', 'unique:courses,course_code,' . $id->id],
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
