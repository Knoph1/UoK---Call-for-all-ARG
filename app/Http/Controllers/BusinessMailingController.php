<?php

namespace App\Http\Controllers;

use App\Models\FailedQueueJob;
use App\Models\QueueJob;
use Illuminate\Http\Request;
use Illuminate\Queue\Jobs\Job;

class BusinessMailingController extends Controller
{
    //
    public function mailinghome()
    {
        return view('pages.mailingmodule.home');
    }
    public function getalljobs()
    {
        $data = QueueJob::all();
        return response()->json($data);
    }

    public function viewjobpage($id)
    {
        $job=QueueJob::where('id',$id)->get()->firstOrFail();
        return view('pages.mailingmodule.viewjobdetails',compact('job'));
    }

    public function getallfailedjobs()
    {
        $data = FailedQueueJob::all();
        return response()->json($data);
    }
    
    public function viewfailedjobdetails($id)
    {
        $job=FailedQueueJob::where('id',$id)->get()->firstOrFail();
        return view('pages.mailingmodule.viewfailedjobdetails',compact('job'));
    }
}
