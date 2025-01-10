<?php

namespace App\Http\Controllers\Proposals;


use App\Http\Controllers\Controller;
use App\Models\Workplan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class WorkplanController extends Controller
{
    //
    public function postworkplanitem(Request $request)
    {
        // Validate incoming request data if needed
        // Define validation rules
        $rules = [
            'activity' => 'required|string', // Example rules, adjust as needed
            'time' => 'required|string', // Adjust data types as per your schema
            'input' => 'required|string',
            'outcome' => 'required|string',
            'facilities' => 'required|string', 
            'bywhom' => 'required|string', 
            'proposalidfk' => 'required|string',
        ];



        // Validate incoming request
        $validator = Validator::make($request->all(), $rules);

        // Check if validation fails
        if ($validator->fails()) {
            // return response()->json(['error' => $validator->errors()], 400);
            return response(['message' => 'Fill all the required Fields!','type'=>'danger'], 400);

        }

        //check if publications are more than 10
        $currentCount = Workplan::where('proposalidfk', $request->input('proposalidfk'))->count();
 

        // Assuming you're retrieving grantno, departmentid, and userid from the request
        $workplan = new Workplan(); // Ensure the model name matches your actual model class name
        // Assign values from the request
        $workplan->activity = $request->input('activity');
        $workplan->input = $request->input('input');
        $workplan->bywhom = $request->input('bywhom');
        $workplan->outcome = $request->input('outcome');  
        $workplan->facilities = $request->input('facilities');  
        $workplan->time = $request->input('time'); 
        $workplan->proposalidfk =$request->input('proposalidfk');
        // Save the proposal
        $workplan->save();

        // Optionally, return a response or redirect
        // return response()->json(['message' => 'Proposal created successfully'], 201);
        return response(['message'=> 'WorkplanItem Saved Successfully!!','type'=>'success']);


    }

    
    public function fetchall()
    {
        $data = Workplan::all();
        return response()->json($data); // Return  data as JSON
    }

    public function fetchsearch(Request $request)
    {
        $searchTerm = $request->input('search');
        $data = Workplan::with('department', 'grantitem', 'themeitem', 'applicant')
            ->where('approvalstatus', 'like', '%' . $searchTerm . '%')
            ->orWhere('highqualification', 'like', '%' . $searchTerm . '%')
            ->orWhereHas('themeitem', function ($query) use ($searchTerm) {
                $query->where('themename', 'like', '%' . $searchTerm . '%');
            })
            ->orWhereHas('applicant', function ($query1) use ($searchTerm) {
                $query1->where('name', 'like', '%' . $searchTerm . '%');
            })
            ->orWhereHas('department', function ($query) use ($searchTerm) {
                $query->where('shortname', 'like', '%' . $searchTerm . '%');
            })
            ->get();
        return response()->json($data); // Return filtered data as JSON
    }

    public function geteditsingleexpenditurepage($id)
    {
        // Find the proposal by ID or fail with a 404 error
        $prop = Workplan::findOrFail($id);
        $isreadonlypage = false;
        $isadminmode = true; 
        // Return the view with the proposal data
        return view('pages.proposals.proposalform', compact('prop', 'isreadonlypage', 'isadminmode', 'departments', 'grants', 'themes'));
    }
}
