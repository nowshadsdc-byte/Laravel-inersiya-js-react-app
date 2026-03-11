<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
class HomePageController extends Controller
{
    public function index()
    {
        $app_name = env('APP_NAME', 'Certificate Verification System');
        return Inertia::render('welcome', ['app_name' => $app_name]);
    }
}
