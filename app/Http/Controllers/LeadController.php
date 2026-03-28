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
use Illuminate\Validation\Rule;
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
        $lead_interests = LeadProfile::distinct()->pluck('interest');

        $leadSources = LeadSource::all();
        return Inertia::render('lead/upload', [
            'leadSources' => $leadSources,
            'leadStatuses' => $leadStatuses,
            'assignedTos' => $assignedTos,
            'townNames' => $townNames,
            'lead_interests' => $lead_interests,
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

    public function addNote($leadId, Request $request)
    {

        $request->validate([
            'note' => ['required', 'string', 'max:255'],
        ]);

        $lead = Lead::where('id', $leadId)->first();

        if (! $lead) {
            return redirect()->route('leads.call-center')->with('error', 'Lead not found');
        }

        LeadNote::create([
            'lead_id' => $lead->id,
            'note' => $request->note,
            'user_id' => auth()->user()->id,
        ]);
        return redirect()->route('leads.call-now', ['id' => $lead->id])->with('success', 'Note added successfully');
    }

    public function create()
    {
        $lead_statuses = LeadStatus::all();
        $lead_sources = LeadSource::all();
        $lead_interests = LeadProfile::all();

        return Inertia::render('lead/create', [
            'lead_statuses' => $lead_statuses,
            'lead_sources' => $lead_sources,
            'lead_interests' => $lead_interests,
        ]);
    }

    public function addCallLog($leadId, Request $request)
    {

        $request->validate([
            'result' => ['required', 'string', 'max:255'],
            'remarks' => ['nullable', 'string', 'max:255'],
            'called_at' => ['nullable', 'date'],

        ]);
        $formateDate = date('Y-m-d H:i:s', strtotime($request->called_at));

        $lead = Lead::where('id', $leadId)->first();

        if (! $lead) {
            return redirect()->route('leads.call-center')->with('error', 'Lead not found');
        }

        LeadCall::create([
            'lead_id' => $lead->id,
            'user_id' => auth()->user()->id,
            'result' => $request->result,
            'remarks' => $request->remarks,
            'called_at' => $formateDate ?? now(),
        ]);


        return redirect()->route('leads.call-now', ['id' => $lead->id])->with('success', 'Call log added successfully');
    }

    public function deleteNote($id)
    {
        $note = LeadNote::where('id', $id)->first();
        if (! $note) {
            return redirect()->route('leads.call-center')->with('error', 'Note not found');
        }
        $note->delete();
        return redirect()->route('leads.call-now', ['id' => $note->lead_id])->with('success', 'Note deleted successfully');
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
            'interest' => ['nullable', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
        ]);

        if (empty($validated['status_id'])) {
            $defaultStatus = LeadStatus::firstOrCreate(['name' => 'New']);
            $validated['status_id'] = $defaultStatus->id;
        }
        if (empty($validated['source_id'])) {
            $defaultSource = LeadSource::firstOrCreate(['name' => 'Facebook']);
            $validated['source_id'] = $defaultSource->id;
        }

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
        if (!empty($validated['interest'])) {
            $leadProfile = LeadProfile::where('lead_id', $lead->id)->first();
            if ($leadProfile) {
                $leadProfile->interest = $validated['interest'];
                $leadProfile->save();
            } else {
                $leadProfile = new LeadProfile();
                $leadProfile->lead_id = $lead->id;
                $leadProfile->interest = $validated['interest'];
                $leadProfile->save();
            }
        }

        return redirect()->route('leads.index')->with('success', 'Lead created successfully');
    }

    public function callCenter()
    {
        $data = Lead::with(['status', 'source', 'notes', 'calls', 'reminders', 'profile'])->latest()->paginate(30);
        $total = Lead::count();
        $sources = LeadSource::all();
        $leadReminders = LeadReminder::with('lead')->where('is_call', true)->get();

     $data = Lead::with(['status', 'source', 'notes', 'calls', 'reminders', 'profile'])->latest()->paginate(30);
        return Inertia::render('lead/callCenter', [
            'leads' => $data,
            'sources' => $sources,
            'total' => $total,
            'leadReminders' => $leadReminders,
        ]);
    }
    public function callupdate(Request $request, $id)
    {

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

        if ($request->type === 'call') {
            LeadCall::create([
                'lead_id' => $lead->id,
                'user_id' => auth()->user()->id,
                'called_at' => $request->called_at,
                'result' => $request->result,
                'remarks' => $request->remarks,
            ]);
        }

        if ($request->type === 'note') {
            LeadNote::create([
                'lead_id' => $lead->id,
                'note' => $request->note,
                'user_id' => auth()->user()->id,
            ]);
        }
        if ($request->type === 'status_change') {
            $lead = Lead::where('id', $id)->first();
            $status = LeadStatus::where('name', $request->status_change)->first();
            if ($status) {
                $lead->status_id = $status->id;
                $lead->save();
                return redirect()->route('leads.call-center')->with('success', 'Status changed successfully');
            }
            return redirect()->route('leads.call-center')->with('error', 'Status not found');
        }
        if ($request->type === 'reminder') {
            LeadReminder::create([
                'lead_id' => $lead->id,
                'user_id' => auth()->user()->id,
                'remind_at' => $request->remind_at,
                'is_completed' => $request->is_completed,
            ]);
        }
        return redirect()->route('leads.call-center')->with('success', 'Call updated successfully');
    }
    public function destroy($id)
    {
        $lead = Lead::where('id', $id)->first();
        if ($lead) {
            $lead->delete();
            return redirect()->route('leads.index')->with('success', 'Lead deleted successfully');
        }
        return redirect()->route('leads.index')->with('error', 'Lead not found');
    }

    public function callNow($id)
    {
        $lead = Lead::where('id', $id)->with(['profile', 'calls', 'notes', 'reminders', 'status', 'source', 'calls.user'])->first();
        $statuses = LeadStatus::all();
        $sources = LeadSource::all();
        $users = User::all();
        $town = $lead->town;
        return Inertia::render('lead/callNow', [
            'lead' => $lead,
            'statuses' => $statuses,
            'sources' => $sources,
            'users' => $users,
            'town' => $town,
        ]);
    }
    public function addReminder($id, Request $request)
    {
        $request->validate([
            'remind_time' => ['required', 'date'],
            'status' => ['required', 'string', 'max:255'],
        ]);

        $lead = Lead::where('id', $id)->first();

        if (! $lead) {
            return redirect()->route('leads.call-center')->with('error', 'Lead not found');
        }

        LeadReminder::create([
            'lead_id' => $lead->id,
            'user_id' => auth()->user()->id,
            'remind_at' => $request->remind_time,
            'is_call' => $request->status === '1' ? true : false,
            'is_completed' => $request->status === '1' ? true : false,
        ]);

        return redirect()->route('leads.call-now', ['id' => $lead->id])->with('success', 'Reminder added successfully');
    }
    public function updateReminder(Request $request)
    {
        $request->validate([
            'reminder_id' => ['required', 'exists:lead_reminders,id'],
            'status' => ['required', 'string', 'max:255'],
        ]);

        $reminder = LeadReminder::where('id', $request->reminder_id)->first();

        if (! $reminder) {
            return redirect()->route('leads.call-center')->with('error', 'Reminder not found');
        }
        $reminder->is_completed = $request->status === '1' ? true : false;
        $reminder->save();
        return redirect()->route('leads.call-now', ['id' => $reminder->lead_id])->with('success', 'Reminder updated successfully');
    }
    public function update(Request $request)
{
    // 1. Set defaults first
    if (empty($request->status_id)) {
        $request->merge([
            'status_id' => LeadStatus::where('name', 'New')->value('id')
        ]);
    }

    if (empty($request->source_id)) {
        $request->merge([
            'source_id' => LeadSource::where('name', 'Facebook')->value('id')
        ]);
    }

    // 2. Validate
    $validated = $request->validate([
        'lead_id' => ['required', 'exists:leads,id'],
        'name' => ['required', 'string', 'max:255'],
        'email' => ['nullable', 'email', 'max:255', Rule::unique('leads', 'email')->ignore($request->lead_id)],
        'phone' => ['nullable', 'string', 'max:20', Rule::unique('leads', 'phone')->ignore($request->lead_id)],
        'whatsapp_number' => ['nullable', 'string', 'max:20', Rule::unique('leads', 'whatsapp_number')->ignore($request->lead_id)],
        'status_id' => ['required', 'exists:lead_statuses,id'],
        'source_id' => ['nullable', 'exists:lead_sources,id'],
        'town' => ['nullable', 'string', 'max:100'],
        'address' => ['nullable', 'string', 'max:255'],
        'assigned_to' => ['nullable'],
        'occupation' => ['nullable', 'string', 'max:255'],
        'interest' => ['nullable', 'string', 'max:255'],
        'company' => ['nullable', 'string', 'max:255'],
    ]);

    // 3. Find lead
    $lead = Lead::find($validated['lead_id']);

    // 4. Update lead
    $lead->update(collect($validated)->except(['lead_id', 'interest'])->toArray());

    // 5. Update profile (interest)
    if (!empty($validated['interest'])) {
        LeadProfile::updateOrCreate(
            ['lead_id' => $lead->id],
            ['interest' => $validated['interest']]
        );
    }

    return redirect()->route('leads.index')->with('success', 'Lead updated successfully');
}
}
