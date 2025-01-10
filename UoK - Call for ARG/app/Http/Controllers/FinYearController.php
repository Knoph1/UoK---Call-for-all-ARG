<?php

namespace App\Http\Controllers;

use App\Models\FinancialYear;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FinYearController extends Controller
{
    //
    public function postnewfinyear(Request $request)
    {
        if(!auth()->user()->haspermission('canaddoreditfinyear')){
            return response(['message'=> 'You do not have permission to Add Financial Year!!','type'=>'danger']);
        }
        // Validate incoming request data if needed
        // Define validation rules
        $rules = [
            'finyear' => 'required|string', // Example rules, adjust as needed
            'startdate' => 'required|date', // Adjust data types as per your schema
            'enddate' => 'required|date',
        ];




        // Validate incoming request
        $validator = Validator::make($request->all(), $rules);

        // Check if validation fails
        if ($validator->fails()) {
            // return response()->json(['error' => $validator->errors()], 400);
            return response(['message' => 'Fill all the required Fields!','type'=>'danger'], 400);

        } 
        if(FinancialYear::where('finyear',$request->input('finyear'))->exists()){
            return response(['message'=> 'The Financial Year already Exists!!','type'=>'danger']);
        }
        // Assuming you're retrieving grantno, departmentid, and userid from the request
        $year = new FinancialYear(); // Ensure the model name matches your actual model class name
        // Assign values from the request
        $year->startdate = $request->input('startdate');
        $year->finyear = $request->input('finyear');
        $year->enddate = $request->input('enddate');
        $year->save();

        // Optionally, return a response or redirect
        // return response()->json(['message' => 'Proposal created successfully'], 201);
        return response(['message'=> 'Financial Year Saved Successfully!!','type'=>'success']);


    }

    public function fetchallfinyears()
    {
        $data = FinancialYear::all();
        return response()->json($data); // Return  data as JSON
    }
}
