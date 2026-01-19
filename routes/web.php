<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BatchController;
use App\Http\Controllers\BillingController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomePageController;
use App\Http\Controllers\PdfController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\VarifyCertificate;
use App\Http\Middleware\HandleInertiaRequests;
use \App\Http\Controllers\ProfilePictureController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;

Route::get('/', [HomePageController::class, 'index'])->name('home');
//public routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    // Profile picture upload
    Route::post('user/profile-picture', [ProfilePictureController::class, '__invoke'])->name('user.profile-picture.upload');
    //Deshboard options
    Route::get('/batch', [BatchController::class, 'index'])->name('batch.index');
    Route::get('/courses', [CourseController::class, 'index'])->name('courses.index');
    // Batch Route
    Route::get('/batch/create', [BatchController::class, 'create'])->name('batch.create');
    Route::get('batch/show/{id}', [BatchController::class, 'show'])->name('batch.show');
    Route::post('/batch/create', [BatchController::class, 'store'])->name('batches.store');
    route::get('/batch/{id}/edit', [BatchController::class, 'edit'])->name('batch.edit');
    route::put('/batch/edit/{id}', [BatchController::class, 'update'])->name('batch.update');
    Route::delete('/batch/{id}', [BatchController::class, 'destroy'])->name('batch.destroy');
    //Course Route
    Route::get('/courses/create', [CourseController::class, 'create'])->name('courses.create');
    Route::post('/courses/create', [CourseController::class, 'store'])->name('courses.store');
    Route::get('/courses/{id}/edit', [CourseController::class, 'edit'])->name('courses.edit');
    Route::put('/courses/edit/{id}', [CourseController::class, 'update'])->name('courses.update');
    Route::delete('/courses/{id}', [CourseController::class, 'destroy'])->name('courses.destroy');
    Route::get('/course/show/{id}', [CourseController::class, 'show'])->name('course.show');
    // Student Route
    Route::get('/students', [StudentController::class, 'index'])->name('student.index');
    Route::get('/students/create', [StudentController::class, 'create'])->name('student.create');
    Route::post('/students/create', [StudentController::class, 'store'])->name('student.store');
    Route::get('/student/edit/{id}', [StudentController::class, 'edit'])->name('student.edit');
    Route::put('/students/edit/{id}', [StudentController::class, 'update'])->name('student.update');
    Route::delete('/student/{id}', [StudentController::class, 'destroy'])->name('student.delete');
    //Student Profile View Route 
    Route::get('/student/profile/{id}', [StudentController::class, 'studentDetails'])->name('student.profile');
    // Certificate Varificattion 
    Route::get('/certificate', [VarifyCertificate::class, 'index'])->middleware('throttle:10,1');
    Route::post('/certificate', [VarifyCertificate::class, 'show'])->middleware('throttle:10,1');
    Route::get('/student/pdf', [PdfController::class, 'student'])->name('student.pdf')->withoutMiddleware([
        HandleInertiaRequests::class,
    ]);
    //Website settings routes
    Route::get('/userspermissions', [RoleController::class, 'index'])->name('users.permissions');
    Route::get('/role/create',[RoleController::class,'create'])->name('role.create');
    Route::post('/role/store',[RoleController::class,'store'])->name('role.store');
    Route::get('/role/edit/{id}',[RoleController::class,'edit'])->name('role.edit');
    Route::put('/role/update/{id}',[RoleController::class,'update'])->name('role.update');
    Route::delete('/role/delete/{id}',[RoleController::class,'destroy'])->name('role.delete');
    //Website user Routes
    Route::get('/users',[UserController::class,'index'])->name('users.index');
    Route::get('/users/create',[UserController::class,'create'])->name('users.create');
    Route::post('/users/create',[UserController::class,'store'])->name('users.store');
    Route::get('/users/edit/{id}',[UserController::class,'edit'])->name('users.edit');
    Route::put('/users/edit/{id}',[UserController::class,'update'])->name('users.update');
    Route::delete('/users/delete/{id}',[UserController::class,'destroy'])->name('users.delete');
    //Billing Routes
    Route::get('/billings',[BillingController::class,'index'])->name('billings.index');

});

require __DIR__ . '/settings.php';
