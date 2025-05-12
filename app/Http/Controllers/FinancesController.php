<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FinancesController extends Controller
{
    //
    public function home()
    {
        $history =[];
        return view('pages.finances.home', compact('history'));
    } 
 
}
