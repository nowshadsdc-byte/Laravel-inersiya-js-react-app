<?php

namespace App\Http\Controllers;

use App\Models\Batch;
use App\Models\Student;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $students = Student::with(['batch', 'batch.course', 'courses'])->latest()->get();
        return Inertia('student/index', compact('students'));
    }
    // Singel Student Profile info 
    public function studentDetails(Student $id) {
        

        $studentData = Student::with(['batch','courses'])->findOrFail($id->id);

        return Inertia::render('student/studentProfile',$studentData);
    }

    /**
     * Show the form for creating a new resource
     */
    public function create()
    {
        $batchs = Batch::all();
        $courses = Course::all();
        return Inertia('student/create', [
            'batchs' => $batchs,
            'courses' => $courses,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $validated = $request->validate([
            'name'       => 'required|string|max:255',
            'email'      => 'required|email|unique:students,email',
            'batch_id'   => 'required|exists:batches,id',
            'course_ids' => 'required|array',        // <-- match frontend
            'course_ids.*' => 'exists:courses,id',  // <-- each course must exist
        ]);

        // create student (batch_id → one to many)
        $student = Student::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'batch_id' => $validated['batch_id'],
        ]);

        // attach courses (many to many)
        $student->courses()->attach($validated['course_ids']);

        return redirect()
            ->route('student.index')
            ->with('success', 'Student created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Student $student)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Student $id)
    {
        $student = Student::with(['batch', 'courses'])->findOrFail($id->id);
        $batchs = Batch::select('id', 'name')->get();
        $courses = Course::select('id', 'name')->get();

        return Inertia::render('student/update', [
            'student' => [
                'id' => $student->id,
                'name' => $student->name,
                'email' => $student->email,
                'batch_id' => $student->batch_id,
                'course_ids' => $student->courses->pluck('id')

            ],
            'batches' => $batchs,
            'courses' => $courses,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Student $id)
    {

        // Validate input
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => [
                'sometimes',
                'required',
                'email',
                Rule::unique('students', 'email')->ignore($id->id),
            ],
            'batch_id' => 'sometimes|required|exists:batches,id',
            'course_ids' => 'nullable|array',
            'course_ids.*' => 'exists:courses,id',
        ]);

        $student = Student::findOrFail($id->id);

        // Only update fields that are in the request
        $fieldsToUpdate = array_intersect_key($validated, array_flip(['name', 'email', 'batch_id']));
        if (!empty($fieldsToUpdate)) {
            $student->update($fieldsToUpdate);
        }

        // Sync courses if provided
        if (array_key_exists('course_ids', $validated)) {
            $student->courses()->sync($validated['course_ids'] ?? []);
        }

        return redirect()
            ->route('student.index')
            ->with('success', 'Student Update successfully');
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Student $id)
    {
        $id->courses()->detach();
        $id->delete();

        return redirect()->route('student.index')->with('sucess', 'Student Update Successfully');
    }
}
