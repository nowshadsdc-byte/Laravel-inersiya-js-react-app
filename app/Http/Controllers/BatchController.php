<?php

namespace App\Http\Controllers;

use App\Models\Batch;
use App\Models\Course;
use Illuminate\Http\Request;
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
            'name' => 'required|string|max:255',
            'batch_code' => 'required',
            'course_id' => 'required|exists:courses,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'TotalClass' => 'required|integer|min:1',
        ]);

        Batch::create($validated);
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
