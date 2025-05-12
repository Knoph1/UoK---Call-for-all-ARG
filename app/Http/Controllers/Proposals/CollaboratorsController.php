<?php

namespace App\Http\Controllers\Proposals;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Collaborator;
use Exception; 
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CollaboratorsController extends Controller
{
    public function getallcollaborators(){

    }
    //
    public function postcollaborator(Request $request)
    {
        if(!auth()->user()->haspermission('canmakenewproposal')){
            return redirect()->route('pages.unauthorized')->with('unauthorizationmessage', "You are not Authorized to Edit the requested Proposal!");
        }
        // Validate incoming request data if needed
        // Define validation rules
        $rules = [
            'collaboratorname' => 'required|string', // Example rules, adjust as needed
            'institution' => 'required|string', // Adjust data types as per your schema
            'position' => 'required|string',
            'researcharea' => 'required|string',
            'experience' => 'required|string', 
            'proposalidfk' => 'required|string', 
        ];



        // Validate incoming request
        $validator = Validator::make($request->all(), $rules);

        // Check if validation fails
        if ($validator->fails()) {
            // $validator->errors()
            return response(['message' => 'Fill all the required Fields!','type'=>'danger'], 400);
        }

        $currentcount = Collaborator::where('proposalidfk',$request->input('proposalidfk'))->count();

        if($currentcount>=5){
            return response(['message'=>'You have reached the maximum number of collaborators allowed!','type'=>'warning']);
        }
        // Assuming you're retrieving grantno, departmentid, and userid from the request
        $collaborator = new Collaborator(); // Ensure the model name matches your actual model class name

        // Assign values from the request
        $collaborator->collaboratorname = $request->input('collaboratorname');
        $collaborator->institution = $request->input('institution');
        $collaborator->position = $request->input('position');
        $collaborator->researcharea = 'researcharea'; 
        $collaborator->experience = $request->input('experience'); 
        $collaborator->proposalidfk = $request->input('proposalidfk'); 
        // Save the proposal
        $collaborator->save();

        // Optionally, return a response or redirect
        // return response()->json(['message' => 'Proposal created successfully'], 201);
        return response(['message'=> 'Collaborator Saved Successfully!!','type'=>'success']);


    }

    public function fetchall()
    {
        $data = Collaborator::with('department', 'grantitem', 'themeitem', 'applicant')->get();
        return response()->json($data); // Return  data as JSON
    }

    public function fetchsearch(Request $request)
    {
        $searchTerm = $request->input('search');
        $data = Collaborator::with('department', 'grantitem', 'themeitem', 'applicant')
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

    public function geteditsinglecollaboratorpage($id)
    {
        // Find the proposal by ID or fail with a 404 error
        $prop = Collaborator::findOrFail($id);
        $isreadonlypage = false;
        $isadminmode = true; 
        // Return the view with the proposal data
        return view('pages.proposals.proposalform', compact('prop', 'isreadonlypage', 'isadminmode', 'departments', 'grants', 'themes'));
    }
}
