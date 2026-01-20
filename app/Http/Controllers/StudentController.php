<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Batch;
use App\Models\Student;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

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
        try {
            DB::beginTransaction();
            // Validation
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
                'status' => 'required|in:active,inactive',
                'batch_id' => 'required|exists:batches,id',
                'course_ids' => 'required|array',
                'course_ids.*' => 'exists:courses,id',
                'photo' => 'nullable|image|max:2048',
            ]);

            // Photo upload
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

            // UID generation
            $batch = $student->batch;

            $courseCode = Course::whereIn('id', $validated['course_ids'])
                ->value('course_code') ?? 'XXX';

            $yymm = Carbon::parse($batch->start_date)->format('ym');

            $lastStudent = Student::where('batch_id', $batch->id)
                ->whereNotNull('student_uid')
                ->latest('id')
                ->first();

            $lastSerial = $lastStudent
                ? (int) substr($lastStudent->student_uid, -6, 4)
                : 0;

            $serialNumber = str_pad($lastSerial + 1, 4, '0', STR_PAD_LEFT);
            $firstLetter = strtoupper(substr($student->name, 0, 1));

            $student->update([
                'student_uid' => "SDC-{$courseCode}-{$yymm}-{$serialNumber}-{$firstLetter}-{$student->id}",
            ]);

            DB::commit();

            return redirect()
                ->route('student.index')
                ->with('success', 'Student created successfully');
        } catch (\Throwable $e) {

            DB::rollBack();
            // Log full error (important for debugging)
            Log::error('Student Create Failed', [
                'error' => $e->getMessage(),
                'file'  => $e->getFile(),
                'line'  => $e->getLine(),
            ]);
            return back()
                ->withInput()
                ->with('error', 'Failed to create student: ' . $e->getMessage());
        }
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
        $studentCourseIds = $student->courses->pluck('id')->toArray();

        return Inertia::render('student/update', [
            'student' => $student,
            'id'=>$student->id,
            'batches' => $batchs,
            'courses' => $courses,
            'student_course_ids' => $studentCourseIds
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Student $id)
    {
        try {
            $student = Student::findorFail($id->id);
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'father_name' => 'required|string|max:255',
                'mother_name' => 'required|string|max:255',
                'email' => 'required|email|unique:students,email' . $student->id,
                'phone' => 'nullable|string|max:20',
                'address' => 'nullable|string',
                'guardian_name' => 'nullable|string|max:255',
                'guardian_phone' => 'nullable|string|max:20',
                'guardian_relation' => 'nullable|string|max:100',
                'status' => 'required|in:active,inactive',
                'batch_id' => 'required|exists:batches,id',
                'course_ids' => 'required|array',
                'course_ids.*' => 'exists:courses,id',
                'photo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048'
            ]);


            // Handle photo upload if present
            $validated['photo'] = $student->photo;

            if ($request->hasFile('photo') && $request->file('photo')->isValid()) {
                // delete old photo (if exists)
                if (!empty($student->photo) && Storage::disk('public')->exists($student->photo)) {
                    Storage::disk('public')->delete($student->photo);
                }

                // store new photo
                $validated['photo'] = $request
                    ->file('photo')
                    ->store('students', 'public');
            }

            $fieldsToUpdate = [];
            foreach ($validated as $key => $value) {
                if ($key === 'course_ids') continue; // handle separately
                // Check for changed values
                if ($key === 'photo' || $id->$key !== $value) {
                    $fieldsToUpdate[$key] = $value;
                }
            }
            // Update only changed fields
            if (!empty($fieldsToUpdate)) {
                $id->update($fieldsToUpdate);
            }

            // Sync courses if provided
            if (array_key_exists('course_ids', $validated)) {
                $id->courses()->sync($validated['course_ids'] ?? []);
            }
            return redirect()
                ->route('student.index')
                ->with('success', 'Student updated successfully');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()
                ->back()
                ->withErrors($e->errors())
                ->withInput();
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', 'Failed to update student. Please try again.')
                ->withInput();
        }
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
