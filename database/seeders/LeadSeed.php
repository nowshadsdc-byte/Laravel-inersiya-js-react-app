<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Illuminate\Support\Str;

class LeadsSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::pluck('id');
        $statuses = DB::table('lead_statuses')->pluck('id');
        $sources = DB::table('lead_sources')->pluck('id');

        $leads = [
            [
                'name' => 'Rahim Uddin',
                'email' => 'rahim@gmail.com',
                'phone' => '01711111111',
                'whatsapp_number' => '01711111111',
                'town' => 'Dhaka',
                'address' => 'Dhanmondi',
            ],
            [
                'name' => 'Karim Hasan',
                'email' => 'karim@gmail.com',
                'phone' => '01822222222',
                'whatsapp_number' => '01822222222',
                'town' => 'Chittagong',
                'address' => 'Agrabad',
            ],
            [
                'name' => 'Nusrat Jahan',
                'email' => 'nusrat@gmail.com',
                'phone' => '01933333333',
                'whatsapp_number' => '01933333333',
                'town' => 'Sylhet',
                'address' => 'Zindabazar',
            ],
            [
                'name' => 'Tanvir Ahmed',
                'email' => 'tanvir@gmail.com',
                'phone' => '01644444444',
                'whatsapp_number' => '01644444444',
                'town' => 'Khulna',
                'address' => 'Sonadanga',
            ],
        ];

        foreach ($leads as $lead) {
            DB::table('leads')->insert([
                'name' => $lead['name'],
                'email' => $lead['email'],
                'phone' => $lead['phone'],
                'whatsapp_number' => $lead['whatsapp_number'],
                'status_id' => $statuses->random(),
                'source_id' => $sources->isNotEmpty() ? $sources->random() : null,
                'assigned_to' => $users->isNotEmpty() ? $users->random() : null,
                'town' => $lead['town'],
                'address' => $lead['address'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}