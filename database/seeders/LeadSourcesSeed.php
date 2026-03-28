<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LeadSourcesSeed extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('lead_sources')->insert([
            [
                'name' => 'Website',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Referral',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Social Media',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Email Campaign',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Event',
                'created_at' => now(),
                'updated_at' => now(),
            ],[
                'name' => 'Other',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Cold Call',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
