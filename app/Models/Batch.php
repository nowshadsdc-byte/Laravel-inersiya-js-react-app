<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Batch extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'course_id',
        'start_date',
        'end_date',
        'TotalClass',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
    public function students()
    {
        return $this->hasMany(Student::class);
    }
}
