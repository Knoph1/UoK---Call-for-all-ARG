<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MyProfileController extends Controller
{ 
    public function myprofile() 
    {
        return view('pages.myprofile');
    }
}
