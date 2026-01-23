<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Models\LeadProfile;
use App\Models\LeadSource;
use App\Models\LeadStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules\In;
use Inertia\Inertia;

class LeadController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = Lead::with(['status', 'source', 'notes', 'calls', 'reminders', 'profile'])->paginate(50);
        $users = DB::table('users')->get();
        $lead_statuses = LeadStatus::all();
        $LeadSources = LeadSource::all();
        $LeadStatus = LeadStatus::all();
        $leadProfile = LeadProfile::all();
        
        return Inertia::render('lead/index', [
            'leads' => $data,
            'users' => $users,
            'lead_statuses' => $lead_statuses,
            'leadSources' => $LeadSources,
            'leadStatus' => $LeadStatus,
            'leadProfile' => $leadProfile,
        ]);
    }
    public function upload()
    {
        return Inertia::render('lead/upload');
    }
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:2048',
        ]);

        try {
            $path = $request->file('file')->getRealPath();
            $rows = array_map('str_getcsv', file($path));
            $header = array_map('trim', array_shift($rows));
            $statusMap = LeadStatus::pluck('id', 'name')->toArray();
            $sourceMap = LeadSource::pluck('id', 'name')->toArray();

              
            DB::transaction(function () use ($rows, $header, $statusMap, $sourceMap) {
                foreach (array_chunk($rows, 500) as $chunk) {
                    $insert = [];

                    foreach ($chunk as $row) {
                        $data = array_combine($header, $row);

                        $insert[] = [
                            'name'        => $data['name'],
                            'email'       => $data['email'] ?? null,
                            'phone'       => $data['phone'] ?? null,
                            'whatsapp_number' => $data['whatsapp'] ?? null,
                            'town'        => $data['town'] ?? null,
                            'status_id'   => $statusMap[$data['status']] ?? $statusMap['new'],
                            'source_id'   => $sourceMap[$data['source']] ?? null,

                            'created_at'  => now(),
                            'updated_at'  => now(),
                        ];
                        
                    }


                   Lead::insert($insert);
                }
            });
            return Inertia::flash([
                'message' => 'Leads imported successfully!',
                'type' => 'success',
            ])->render('lead/index', [
                'data' => Lead::with(['status', 'source'])->paginate(15),
            ]);
        } catch (\Throwable $e) {
            dd($e);
            // error response
            return Inertia::flash([
                'message' => 'Import failed: ' . $e->getMessage(),
                'type' => 'error',
            ])->render('lead/index', [
            
                'data' => Lead::with(['status', 'source'])->paginate(15),
            ]);
        }
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
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
