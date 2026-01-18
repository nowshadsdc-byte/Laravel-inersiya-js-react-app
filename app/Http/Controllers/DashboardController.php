<?php

namespace App\Http\Controllers;

use App\Models\Batch;
use App\Models\Course;
use App\Models\Student;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(){

        $totalStudetn = Student::Count();
        $totalBatch= Batch::Count();
        $totalCourses = Course::Count();
        return Inertia::render('dashboard',[
            'totalStudent'=> $totalStudetn,
            'totalBatchs'=>$totalBatch,
            'totalCourses'=>$totalCourses
        ]);
    }
    public function usersPermissions(){
        return Inertia::render('settings/UsersPermissions');
    }
}
