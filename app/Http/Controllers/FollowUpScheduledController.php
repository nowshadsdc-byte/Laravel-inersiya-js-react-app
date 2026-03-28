<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Models\LeadReminder;
use Carbon\Carbon;
use Inertia\Inertia;

class FollowUpScheduledController extends Controller
{
    public function index()
    {
        $data = Lead::with(['reminders'])->latest()->get()->toArray();
        $leads = LeadReminder::with('lead')
            ->where('is_completed', 0)
            ->get()
            ->sortByDesc('updated_at')   // latest first
            ->unique('lead_id')          // pick first per lead
            ->values()
            ->map(function ($reminder) {
                return [
                    'id' => $reminder->id,
                    'remind_at' => Carbon::parse($reminder->remind_at)->format('Y-m-d'),
                    'lead' => [
                        'id' => $reminder->lead->id,
                        'name' => $reminder->lead->name,
                        'phone' => $reminder->lead->phone,
                    ],
                ];
            });

        




        // $leads = LeadReminder::with('lead')->where('is_completed', '==', '0')->get()->map(function ($reminder) {
        //     return [
        //         'id' => $reminder->id,
        //         'remind_at' => Carbon::parse($reminder->remind_at)->format('Y-m-d'),
        //         'lead' => [
        //             'id' => $reminder->lead->id,
        //             'name' => $reminder->lead->name,
        //             'phone' => $reminder->lead->phone,
        //         ],
        //     ];
        // });

        return Inertia::render('lead/FollowUpScheduled', [
            'leads' => $leads,
        ]);
    }
}
