<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LeadStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('lead_statuses')->insert([
            [
                'name' => 'New',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Contacted',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Qualified',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Lost',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'converted',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Pending',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
