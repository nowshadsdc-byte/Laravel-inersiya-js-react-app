<?php

namespace App\Http\Controllers;

use App\Models\Batch;
use App\Models\Course;
use App\Models\Lead;
use App\Models\Student;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(){

        $lead = Lead::all();
        $totalStudetn = Student::Count();
        $totalBatch= Batch::Count();
        $totalCourses = Course::Count();
        $totalleads = Lead::Count();
        
        $ActiveCalls = "0";

        $lead = "0";

        $ConversionRate ="0%";

        $Follow_ups_Today = "0";

        return Inertia::render('dashboard',[
            'totalStudent'=> $totalStudetn,
            'totalBatchs'=>$totalBatch,
            'totalCourses'=>$totalCourses,
            'totalLeads'=>$totalleads,
            'activeCalls'=>$ActiveCalls,
            'conversionRate'=>$ConversionRate,
            'followUpsToday'=>$Follow_ups_Today
        ]);

    }
    public function usersPermissions(){
        return Inertia::render('settings/UsersPermissions');
    }
}
