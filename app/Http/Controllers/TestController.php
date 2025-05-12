<?php

namespace App\Http\Controllers;

use DateTime;
use Illuminate\Http\Request;

class TestController extends Controller
{
    
    function test()
    {
        $currentDate = new DateTime();
        $currentYear = $currentDate->format('Y');
        $currentMonth = (int) $currentDate->format('m'); // Convert month to integer

        // Financial year starts in July
        $financialYearStartMonth = 7; // July is 7 (1-based index)

        if ($currentMonth >= $financialYearStartMonth) {
            // From July to December, the financial year starts this year
            return "{$currentYear}/" . ($currentYear + 1);
        } else {
            // From January to June, the financial year started last year
            return ($currentYear - 1) . "/{$currentYear}";
        }
    }
}
