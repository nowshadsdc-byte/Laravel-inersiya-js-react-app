<?php

namespace Database\Factories;

use App\Models\Batch;
use Illuminate\Database\Eloquent\Factories\Factory;

class BatchFactory extends Factory
{
    protected $model = Batch::class;

    public function definition()
    {
        return [
            'name' => $this->faker->word() . ' Batch',
            // placeholder to satisfy non-null foreign key during creation; updated in seeder
            'course_id' => 0,
            'start_date' => $this->faker->date(),
            'end_date' => $this->faker->date(),
            'TotalClass' => (string) $this->faker->numberBetween(5, 40),
        ];
    }
}
