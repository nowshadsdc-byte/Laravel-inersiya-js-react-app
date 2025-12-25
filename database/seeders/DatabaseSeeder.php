<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Course;
use App\Models\Batch;
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
        // User::factory(10)->create();

        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );

        // Toggle foreign key checks while we seed circular FK columns (driver-specific)
        $driver = DB::getDriverName();

        if ($driver === 'mysql') {
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        } elseif ($driver === 'sqlite') {
            DB::statement('PRAGMA foreign_keys = OFF;');
        } elseif ($driver === 'pgsql') {
            DB::statement('SET CONSTRAINTS ALL DEFERRED;');
        }

        Course::factory()->count(10)->create();
        Batch::factory()->count(10)->create();

        $courses = Course::all();
        $batches = Batch::all();

        $count = min($courses->count(), $batches->count());

        for ($i = 0; $i < $count; $i++) {
            $course = $courses[$i];
            $batch = $batches[$i];

            $course->batch_id = $batch->id;
            $course->save();

            $batch->course_id = $course->id;
            $batch->save();
        }

        if ($driver === 'mysql') {
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        } elseif ($driver === 'sqlite') {
            DB::statement('PRAGMA foreign_keys = ON;');
        } elseif ($driver === 'pgsql') {
            DB::statement('SET CONSTRAINTS ALL IMMEDIATE;');
        }
    }
}
