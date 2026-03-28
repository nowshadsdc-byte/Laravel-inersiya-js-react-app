<?php

namespace App\Http\Controllers;

use App\Models\Batch;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class BatchController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $batches = Batch::with('course')->latest()->get();
        return Inertia::render('batch/index', [
            'batches' => $batches
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('batch/create', ['courses' => Course::select('id', 'name')->get(),]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'batch_code' => ['required', 'string', 'max:100', Rule::unique('batches', 'batch_code')],
            'course_id' => ['required', 'exists:courses,id'],
            'start_date' => ['required', 'date', ],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'TotalClass' => ['required', 'integer', 'min:1', 'max:500'],
            'batch_status' => ['required', 'string', 'max:50'],
        ], [
            // Name
            'name.required' => 'Batch name is required.',
            'name.max' => 'Batch name can’t be longer than 255 characters.',

            // Batch Code
            'batch_code.required' => 'Batch code is required.',
            'batch_code.unique' => 'This batch code is already in use. Please choose a different one.',

            // Course
            'course_id.required' => 'Please select a course.',
            'course_id.exists' => 'The selected course does not exist.',

            // Dates
            'start_date.required' => 'Start date is required.',
            'start_date.after_or_equal' => 'Start date cannot be in the past.',
            'end_date.required' => 'End date is required.',
            'end_date.after_or_equal' => 'End date must be the same as or later than the start date.',

            // Total Class
            'TotalClass.required' => 'Total class count is required.',
            'TotalClass.integer' => 'Total class must be a whole number.',
            'TotalClass.min' => 'Total class must be at least 1.',
            'TotalClass.max' => 'Total class looks too large. Please double-check.',
            // Batch Status
            'batch_status.required' => 'Batch status is required.',
        ]);

        $batch = Batch::create($validated);

        if (! $batch) {
            return back()->withErrors([
                'general' => 'Batch could not be created due to a server issue. Please try again.'
            ]);
        }
        return redirect()->route('batch.index')->with('success', 'Batch created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Batch $id)
    {
        $batchData = Batch::with(
            'students',
            'course:id,name'
        )->findOrFail($id->id);

        return Inertia::render("batch/show", [
            'batch' => $batchData
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Batch $id)
    {
        $data = Batch::findOrFail($id->id);

        $batch = [
            'id' => $data->id,
            'name' => $data->name,
            'course_id' => $data->course_id,
            'batch_code' => $data->batch_code,
            'start_date' => $data->start_date,
            'end_date' => $data->end_date,
            'TotalClass' => $data->TotalClass,
            'batch_status' => $data->batch_status,
        ];
        return Inertia::render('batch/update', [
            'batch' => $batch,
            'courses' => Course::select('id', 'name')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Batch $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'course_id' => 'required|exists:courses,id',
            'start_date' => 'required|date',
            'batch_code' => 'required | string',
            'end_date' => 'required|date|after_or_equal:start_date',
            'TotalClass' => 'required|integer|min:1',
            'batch_status' => 'required|string|max:50',
        ]);

        $batch = Batch::findOrFail($id->id);
        $batch->update($validated);

        if ($batch) {
            return redirect()->route('batch.index')->with('success', 'Batch updated successfully.');
        } else {
            return redirect()->back()->with('error', 'Failed to update batch.');
        }
    }

    public function destroy(Batch $id)
    {
        $id->delete();
        return redirect()->route('batch.index')->with('success', 'Batch deleted successfully.');
    }
}
