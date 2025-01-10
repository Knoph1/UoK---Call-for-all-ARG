<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommonPagesController extends Controller
{
    //default/index/root page for the portal
    public function index()
    {
        if (Auth::check()) {
            return redirect()->route('pages.dashboard');
        }
        return view('pages.common.home');
    }

    //
    public function setupadmin()
    {
        return view('pages.common.setupadmin');
    }
    //About ARG portal page
    public function about()
    {
        return view('pages.common.about');
    }


    //login page
    public function login()
    {
        return view('pages.auth.login');
    }

    //Register new account page
    public function register()
    {
        return view('pages.auth.register');
    }
}
