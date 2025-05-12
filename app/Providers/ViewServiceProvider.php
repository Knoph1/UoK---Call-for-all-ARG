<?php
// app/Providers/ViewServiceProvider.php

namespace App\Providers;

use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;
use App\Models\Permissions;
use App\Models\User;
use Illuminate\Support\Facades\Auth; // Import Auth facade

class ViewServiceProvider extends ServiceProvider
{
    public function boot()
    {
        // Use a closure based composer...
        View::composer('layouts.master', function ($view) {
            // Fetch the userId parameter passed to the view composer
            // Fetch permissions for the current logged-in user
            $user = Auth::user();
            if ($user) {
                $default = $user->defaultpermissions()->orderBy('priorityno')->get();
                $allpermissions = $user->permissions()->orderBy('permissionlevel')->get();
                // Ensure that default permissions are added to allpermissions if they don't exist
                // foreach ($default as $per) {
                //     if (!$allpermissions->contains('pid', $per->pid)) {
                //         $allpermissions->push($per);
                //     }
                // }
                $menupermissions = $allpermissions->where('permissionlevel', 1);

            } else {
                $permissions = collect(); // or any default value
            }

            // Pass the data to the view
            $view->with('permissions', $allpermissions)->with('menu', $menupermissions);
        });
    }

    public function register()
    {
        //
    }
}
