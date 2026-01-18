<?php

namespace App\Providers;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Container bindings only — nothing else
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        
    }
}
