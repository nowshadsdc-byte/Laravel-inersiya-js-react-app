<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Models\LeadCall;
use App\Models\LeadProfile;
use App\Models\LeadSource;
use App\Models\LeadStatus;
use App\Models\User;
use App\Models\LeadNote;
use App\Models\LeadReminder;
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
        $data = Lead::with(['status', 'source', 'notes', 'calls', 'reminders', 'profile'])->latest()->get();
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
        $leadSources = LeadSource::all();
        $leadStatuses = LeadStatus::all();
        $assignedTos = DB::table('users')->get();
        $townNames = DB::table('leads')->distinct()->pluck('town');

        $leadSources = LeadSource::all();
        return Inertia::render('lead/upload', [
            'leadSources' => $leadSources,
            'leadStatuses' => $leadStatuses,
            'assignedTos' => $assignedTos,
            'townNames' => $townNames,
        ]);
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:2048',
        ]);

        try {
            $file = $request->file('file');

            if (! $file->isValid()) {
                return back()->withErrors(['file' => 'Invalid file uploaded.']);
            }

            $path = $file->getRealPath();
            $fileContent = file($path);

            if (empty($fileContent)) {
                return back()->withErrors(['file' => 'The CSV file is empty.']);
            }

            $rows = array_map('str_getcsv', $fileContent);

            if (empty($rows)) {
                return back()->withErrors(['file' => 'The CSV file contains no data rows.']);
            }

            $header = array_map('trim', array_shift($rows));

            // Validate required headers
            $requiredHeaders = ['name', 'status'];
            $missingHeaders = array_diff($requiredHeaders, $header);

            if (! empty($missingHeaders)) {
                return back()->withErrors([
                    'file' => 'Missing required columns: ' . implode(', ', $missingHeaders) . '. Required columns: name, status. Optional columns: email, phone, whatsapp, town, source.',
                ]);
            }

            // Load existing statuses and sources (case-insensitive lookup)
            $allStatuses = LeadStatus::all();
            $allSources = LeadSource::all();

            // Create case-insensitive maps for lookup
            $statusMap = [];
            foreach ($allStatuses as $status) {
                $statusMap[strtolower($status->name)] = $status->id;
                $statusMap[$status->name] = $status->id; // Also keep original case
            }

            $sourceMap = [];
            foreach ($allSources as $source) {
                $sourceMap[strtolower($source->name)] = $source->id;
                $sourceMap[$source->name] = $source->id; // Also keep original case
            }

            // Get default status (first status or 'New' if exists)
            $defaultStatusId = $statusMap['New'] ?? $statusMap['new'] ?? ($statusMap ? reset($statusMap) : null);

            if (! $defaultStatusId) {
                // Create a default 'New' status if none exists
                $defaultStatus = LeadStatus::firstOrCreate(['name' => 'New']);
                $defaultStatusId = $defaultStatus->id;
                $statusMap['new'] = $defaultStatusId;
                $statusMap['New'] = $defaultStatusId;
            }

            $errors = [];
            $insert = [];
            $rowNumber = 2; // Start at 2 because header is row 1
            $createdStatuses = [];
            $createdSources = [];

            DB::beginTransaction();

            try {
                foreach ($rows as $row) {
                    // Skip empty rows
                    if (empty(array_filter($row))) {
                        $rowNumber++;
                        continue;
                    }

                    // Validate row has same number of columns as header
                    if (count($row) !== count($header)) {
                        $errors[] = "Row {$rowNumber}: Column count mismatch. Expected " . count($header) . ' columns, found ' . count($row) . '.';
                        $rowNumber++;

                        continue;
                    }

                    $data = array_combine($header, $row);

                    if ($data === false) {
                        $errors[] = "Row {$rowNumber}: Failed to map columns to header.";
                        $rowNumber++;

                        continue;
                    }

                    // Validate required fields
                    if (empty(trim($data['name'] ?? ''))) {
                        $errors[] = "Row {$rowNumber}: Name is required.";
                        $rowNumber++;

                        continue;
                    }

                    $statusName = trim($data['status'] ?? '');
                    $statusId = null;

                    if (! empty($statusName)) {
                        // Try exact match first
                        $statusId = $statusMap[$statusName] ?? null;

                        // Try case-insensitive match
                        if (! $statusId) {
                            $statusId = $statusMap[strtolower($statusName)] ?? null;
                        }

                        // If still not found, check database case-insensitively before creating
                        if (! $statusId) {
                            $status = LeadStatus::whereRaw('LOWER(name) = ?', [strtolower($statusName)])->first();

                            if (! $status) {
                                $status = LeadStatus::create(['name' => $statusName]);
                                $createdStatuses[] = $statusName;
                            }

                            $statusId = $status->id;
                            $statusMap[$statusName] = $statusId;
                            $statusMap[strtolower($statusName)] = $statusId;
                        }
                    } else {
                        $statusId = $defaultStatusId;
                    }

                    $sourceId = null;
                    if (! empty($data['source'] ?? '')) {
                        $sourceName = trim($data['source']);

                        // Try exact match first
                        $sourceId = $sourceMap[$sourceName] ?? null;

                        // Try case-insensitive match
                        if (! $sourceId) {
                            $sourceId = $sourceMap[strtolower($sourceName)] ?? null;
                        }

                        // If still not found, check database case-insensitively before creating
                        if (! $sourceId) {
                            $source = LeadSource::whereRaw('LOWER(name) = ?', [strtolower($sourceName)])->first();

                            if (! $source) {
                                $source = LeadSource::create(['name' => $sourceName]);
                                $createdSources[] = $sourceName;
                            }

                            $sourceId = $source->id;
                            $sourceMap[$sourceName] = $sourceId;
                            $sourceMap[strtolower($sourceName)] = $sourceId;
                        }
                    }

                    $insert[] = [
                        'name' => trim($data['name']),
                        'email' => ! empty($data['email'] ?? '') ? trim($data['email']) : null,
                        'phone' => ! empty($data['phone'] ?? '') ? trim($data['phone']) : null,
                        'whatsapp_number' => ! empty($data['whatsapp'] ?? '') ? trim($data['whatsapp']) : null,
                        'town' => ! empty($data['town'] ?? '') ? trim($data['town']) : null,
                        'status_id' => $statusId,
                        'source_id' => $sourceId,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];

                    $rowNumber++;
                }

                // If there are critical errors (not missing statuses/sources), rollback and return
                if (! empty($errors)) {
                    DB::rollBack();

                    return back()->withErrors([
                        'file' => 'Validation errors found: ' . implode(' ', array_slice($errors, 0, 10)) . (count($errors) > 10 ? ' (and ' . (count($errors) - 10) . ' more errors)' : ''),
                    ]);
                }

                // Insert in chunks
                if (! empty($insert)) {
                    foreach (array_chunk($insert, 500) as $chunk) {
                        Lead::insert($chunk);
                    }
                } else {
                    DB::rollBack();

                    return back()->withErrors(['file' => 'No valid rows to import.']);
                }

                DB::commit();

                // Build success message
                $message = 'Leads imported successfully! ' . count($insert) . ' lead(s) imported.';
                if (! empty($createdStatuses)) {
                    $uniqueStatuses = array_unique($createdStatuses);
                    $message .= ' Created ' . count($uniqueStatuses) . ' new status(es): ' . implode(', ', $uniqueStatuses) . '.';
                }
                if (! empty($createdSources)) {
                    $uniqueSources = array_unique($createdSources);
                    $message .= ' Created ' . count($uniqueSources) . ' new source(s): ' . implode(', ', $uniqueSources) . '.';
                }

                return redirect()->route('leads.index')->with('success', $message);
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors());
        } catch (\Throwable $e) {
            return back()->withErrors([
                'file' => 'Import failed: ' . $e->getMessage() . ' (Line: ' . ($e->getLine() ?? 'unknown') . ')',
            ]);
        }
    }

    public function create()
    {

        $lead_statuses = LeadStatus::all();
        $lead_sources = LeadSource::all();

        return Inertia::render('lead/create', [
            'lead_statuses' => $lead_statuses,
            'lead_sources' => $lead_sources,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255', 'unique:leads,email'],
            'phone' => ['nullable', 'string', 'max:20', 'unique:leads,phone'],
            'whatsapp_number' => ['nullable', 'string', 'max:20', 'unique:leads,whatsapp_number'],
            'status_id' => ['required', 'exists:lead_statuses,id'],
            'source_id' => ['nullable', 'exists:lead_sources,id'],
            'town' => ['nullable', 'string', 'max:100'],
            'address' => ['nullable', 'string', 'max:255'],
            'lead_notes' => ['nullable', 'string', 'max:255'],
            'assigned_to' => ['nullable', 'string', 'max:255'],
            'occupation' => ['nullable', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
        ]);

        $lead = Lead::create(collect($validated)->except('lead_notes')->toArray());

        if (!empty($validated['lead_notes'])) {
            $lead->notes()->create([
                'lead_id' => $lead->id,
                'note' => $validated['lead_notes'],
                'user_id' => auth()->user()->id,
            ]);
        }

        if (!empty($validated['assigned_to'])) {
            $user = User::where('id', $validated['assigned_to'])->first();
            if ($user) {
                $lead->assigned_to = $user->id;
                $lead->save();
            }
        }
        if (!empty($validated['occupation'])) {
            $leadProfile = new LeadProfile();
            $leadProfile->lead_id = $lead->id;
            $leadProfile->occupation = $validated['occupation'];
            $leadProfile->company = $validated['company'] ?? null;
            $leadProfile->save();
        }

        return redirect()->route('leads.index')->with('success', 'Lead created successfully');
    }

    public function callCenter()
    {
        $data = Lead::with(['status', 'source', 'notes', 'calls', 'reminders', 'profile'])->latest()->paginate(30);
        $total = Lead::count();
        $sources = LeadSource::all();
        $leadReminders = LeadReminder::with('lead')->get();
        
        return Inertia::render('lead/callCenter', [
            'leads' => $data,
            'sources' => $sources,
            'total' => $total,
            'leadReminders' => $leadReminders,
        ]);
    }
    public function callupdate(Request $request,$id){
       
        $request->validate([
            'type' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
            'called_at' => ['nullable', 'date'],
            'result' => ['nullable', 'string', 'max:255'],
            'remarks' => ['nullable', 'string', 'max:255'],
            'remind_at' => ['nullable', 'date'],
            'is_completed' => ['nullable', 'boolean'],
            'note' => ['nullable', 'string', 'max:255'],
        ]);

        $lead = Lead::where('id', $id)->first();

        if($request->type === 'call'){
            LeadCall::create([
                'lead_id' => $lead->id,
                'user_id' => auth()->user()->id,
                'called_at' => $request->called_at,
                'result' => $request->result,
                'remarks' => $request->remarks,
            ]);
        }

        if($request->type === 'note'){
            LeadNote::create([
                'lead_id' => $lead->id,
                'note' => $request->note,
                'user_id' => auth()->user()->id,
            ]);
        }
        if($request->type === 'status_change'){
            $lead = Lead::where('id', $id)->first();
            $status = LeadStatus::where('name', $request->status_change)->first();  
            if($status){
                $lead->status_id = $status->id;
                $lead->save();
                return redirect()->route('leads.call-center')->with('success', 'Status changed successfully');
            }
            return redirect()->route('leads.call-center')->with('error', 'Status not found');
        }
        if($request->type === 'reminder'){
            LeadReminder::create([
                'lead_id' => $lead->id,
                'user_id' => auth()->user()->id,
                'remind_at' => $request->remind_at,
                'is_completed' => $request->is_completed,
            ]);
        }
        return redirect()->route('leads.call-center')->with('success', 'Call updated successfully');
    }
}
