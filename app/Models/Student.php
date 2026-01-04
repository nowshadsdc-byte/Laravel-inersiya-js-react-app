<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'father_name',
        'mother_name',
        'student_uid',
        'phone',
        'status',
        'email',
        'photo',
        'address',
        'guardian_name',
        'guardian_phone',
        'guardian_relation',
        'batch_id',
    ];



    protected $guarded = [];


    public function courses()
    {
        return $this->belongsToMany(Course::class);
    }

    public function batch()
    {
        return $this->belongsTo(Batch::class);
    }
}
