<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LeadCallSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // DB::table('lead_calls')->insert([
        //     [
        //         'lead_id' => 7,
        //         'user_id' => 1,
        //         'called_at' => Carbon::now()->subDays(2),
        //         'result' => 'answered',
        //         'remarks' => 'Client answered and showed initial interest.',
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ],
        //     [
        //         'lead_id' => 7,
        //         'user_id' => 1,
        //         'called_at' => Carbon::now()->subDay(),
        //         'result' => 'follow_up_required',
        //         'remarks' => 'Asked to call again tomorrow.',
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ],
        //     [
        //         'lead_id' => 7,
        //         'user_id' => 1,
        //         'called_at' => Carbon::now()->subHours(5),
        //         'result' => 'no_answer',
        //         'remarks' => 'No response from client.',
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ],
        //     [
        //         'lead_id' => 7,
        //         'user_id' => 2,
        //         'called_at' => Carbon::now()->subHours(3),
        //         'result' => 'interested',
        //         'remarks' => 'Client is interested in service.',
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ],
        //     [
        //         'lead_id' => 7,
        //         'user_id' => 2,
        //         'called_at' => Carbon::now(),
        //         'result' => 'converted',
        //         'remarks' => 'Successfully converted to customer.',
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ],
        // ]);
    }
}
