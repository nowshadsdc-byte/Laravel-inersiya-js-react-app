<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\BatchController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\StudentController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Profile picture upload
    Route::post('user/profile-picture', [\App\Http\Controllers\ProfilePictureController::class, '__invoke'])->name('user.profile-picture.upload');

    //Deshboard options
    Route::get('/batch', [BatchController::class, 'index'])->name('batch.index');
    Route::get('/courses', [CourseController::class, 'index'])->name('courses.index');


    Route::get('/batch/create', [BatchController::class, 'create'])->name('batch.create');
    Route::post('/batch/create', [BatchController::class, 'store'])->name('batches.store');
    route::get('/batch/{id}/edit', [BatchController::class, 'edit'])->name('batch.edit');
    route::put('/batch/edit/{id}', [BatchController::class, 'update'])->name('batch.update');
    Route::delete('/batch/{id}', [BatchController::class, 'destroy'])->name('batch.destroy');


    Route::get('/courses/create', [CourseController::class, 'create'])->name('courses.create');
    Route::post('/courses/create', [CourseController::class, 'store'])->name('courses.store');
    Route::get('/courses/{id}/edit', [CourseController::class, 'edit'])->name('courses.edit');
    Route::put('/courses/edit/{id}', [CourseController::class, 'update'])->name('courses.update');
    Route::delete('/courses/{id}', [CourseController::class, 'destroy'])->name('courses.destroy');

    // Student Route
    Route::get('/students', [StudentController::class, 'index'])->name('student.index');
    Route::get('/students/create', [StudentController::class, 'create'])->name('student.create');
    Route::post('/students/create', [StudentController::class, 'store'])->name('student.store');
    Route::get('/student/edit/{id}',[StudentController::class,'edit'])->name('student.edit');
    Route::put('/students/edit/{id}',[StudentController::class,'update'])->name('student.update');
    Route::delete('/student/{id}',[StudentController::class,'destroy'])->name('student.delete');

    //Student Profile View Route 
    Route::get('/student/profile/{id}',[StudentController::class,'studentDetails'])->name('student.profile');
});

require __DIR__ . '/settings.php';
