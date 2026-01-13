<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;


class PdfController extends Controller
{
    public function student()
    {

        $data = Student::latest()->get();
        $pdf = Pdf::loadView('pdf.students', [
            'students' => "Data",
        ])->setPaper('a4', 'portrait');

        return response()->streamDownload(
            fn() => print($pdf->output()),
            'students.pdf',
            [
                'Content-Type' => 'application/pdf',
            ]
        );
    }
    public function varifycopy(Request $request, Student $id){
        

    }
}
