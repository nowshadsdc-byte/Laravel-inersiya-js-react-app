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
    public function studentDetails(Student $id)
    {

        $studentData = Student::with(['batch', 'courses'])->findOrFail($id->id);
        return Inertia::render('student/studentProfile', [
            'studentData' => $studentData,
        ]);
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
        // Validate all inputs
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'father_name' => 'required|string|max:255',
            'mother_name' => 'required|string|max:255',
            'email' => 'required|email|unique:students,email',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'guardian_name' => 'nullable|string|max:255',
            'guardian_phone' => 'nullable|string|max:20',
            'guardian_relation' => 'nullable|string|max:100',
            'status' => 'required|string|in:active,inactive',
            'batch_id' => 'required|exists:batches,id',
            'course_ids' => 'required|array',
            'course_ids.*' => 'exists:courses,id',
            'photo' => 'nullable|image|max:2048', // 2MB
        ]);

        // Handle photo upload
        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('students', 'public');
        }

        // Create student
        $student = Student::create([
            'name' => $validated['name'],
            'father_name' => $validated['father_name'],
            'mother_name' => $validated['mother_name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'address' => $validated['address'] ?? null,
            'guardian_name' => $validated['guardian_name'] ?? null,
            'guardian_phone' => $validated['guardian_phone'] ?? null,
            'guardian_relation' => $validated['guardian_relation'] ?? null,
            'status' => $validated['status'],
            'batch_id' => $validated['batch_id'],
            'photo' => $photoPath,
        ]);

        // Attach courses
        $student->courses()->attach($validated['course_ids']);

        // 5. Generate Student UID
        $batch = $student->batch;
        $firstCourse = $student->courses()->first(); // take first course
        $courseCode = $firstCourse->code ?? 'XXX';

        // YYMM from batch start date
        $yymm = "2025";

        // SERIAL4: running serial for this batch
        $serialCount = Student::where('batch_id', $batch->id)->count();
        $serialNumber = str_pad($serialCount, 4, '0', STR_PAD_LEFT); // e.g., 0001, 0002

        // First letter of student name
        $firstLetter = strtoupper(substr($student->name, 0, 1));

        // Final UID
        $studentUid = "SDC-{$courseCode}-{$yymm}-{$serialNumber}-{$firstLetter}";

        // Save UID
        $student->student_uid = $studentUid;
        $student->save();


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
