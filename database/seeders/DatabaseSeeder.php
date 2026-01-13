<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Course;
use App\Models\Batch;
use App\Models\Student;
use Illuminate\Support\Facades\DB;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
   public function run(): void
{
    $this->call(RolePermissionSeeder::class);
    
    User::factory(10)->create();

    User::firstOrCreate(
        ['email' => 'test@example.com'],
        [
            'name' => 'Test User',
            'password' => 'password',
            'email_verified_at' => now(),
        ]
    );

    // Create courses with batches and students
    Course::factory()
        ->count(10)
        ->create()
        ->each(function ($course) {

            // each course has 2 batches
            Batch::factory()
                ->count(2)
                ->create([
                    'course_id' => $course->id,
                ])
                ->each(function ($batch) {

                    // each batch has 5 students
                    Student::factory()
                        ->count(5)
                        ->create([
                            'batch_id' => $batch->id,
                        ]);
                });
        });
}
}
