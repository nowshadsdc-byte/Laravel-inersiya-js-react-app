<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;
    public $fillable = ['name','description'];
    
    public function batch(){
        return $this->hasMany(Batch::class, 'course_id', 'id');
    }
}
