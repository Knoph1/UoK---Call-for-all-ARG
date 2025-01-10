<?php

namespace App\Http\Controllers\Proposals;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Publication;
use Exception; 
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
class PublicationsController extends Controller
{
    //
    public function postpublication(Request $request)
    {
        // Validate incoming request data if needed
        // Define validation rules
        $rules = [
            'authors' => 'required|string', // Example rules, adjust as needed
            'year' => 'required|string', // Adjust data types as per your schema
            'pubtitle' => 'required|string',
            'researcharea' => 'required|string',
            'publisher' => 'required|string',
            'volume' => 'required|string', 
            'pubpages' => 'required|integer', 
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
        $currentCount = Publication::where('proposalidfk', $request->input('proposalidfk'))->count();

        if($currentCount>=5){
            return response(['message'=>'You have reached the maximum number of Publications allowed!','type'=>'warning']);
        }

        // Assuming you're retrieving grantno, departmentid, and userid from the request
        $publication = new Publication(); // Ensure the model name matches your actual model class name
        // Assign values from the request
        $publication->authors = $request->input('authors');
        $publication->year = $request->input('year');
        $publication->title = $request->input('pubtitle');
        $publication->volume = $request->input('volume');  
        $publication->researcharea = $request->input('researcharea'); 
        $publication->pages = $request->input('pubpages');
        $publication->proposalidfk = $request->input('proposalidfk'); 
        $publication->publisher = $request->input('publisher');
        // Save the proposal
        $publication->save();

        // Optionally, return a response or redirect
        // return response()->json(['message' => 'Proposal created successfully'], 201);
        return response(['message'=> 'Publication Saved Successfully!!','type'=>'success']);


    }
}
