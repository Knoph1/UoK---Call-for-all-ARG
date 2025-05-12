<?php

namespace App\Http\Controllers;

use App\Models\Proposal;
use App\Models\ResearchFunding;
use App\Models\ResearchProgress;
use App\Models\ResearchProject;
use App\Models\User;
use Auth;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProjectsController extends Controller
{
    //
    public function myprojects()
    {
        if (!auth()->user()->hasPermission('canviewmyprojects')) {
            return redirect()->route('pages.unauthorized')->with('unauthorizationmessage', "You are not Authorized to view your Projects!");
        }

        // Return the view with the necessary data
        return view('pages.projects.myprojects');
    }
    public function fetchmyactiveprojects()
    {
        if (!auth()->user()->hasPermission('canviewmyprojects')) {
            return redirect()->route('pages.unauthorized')->with('unauthorizationmessage', "You are not Authorized to view your Projects!");
        }

        $userid = auth()->user()->userid;

        // Fetch projects where the related proposals' useridfk matches the current user
        $myprojects = ResearchProject::with('proposal')
            ->whereHas('proposal', function ($query) use ($userid) {
                $query->where('useridfk', $userid);
            })
            ->where('projectstatus', 'Active')
            ->with('proposal')
            ->with('applicant')
            ->get();
        // Return the view with the necessary data
        return response()->json($myprojects);
    }
    public function fetchmyallprojects()
    {
        if (!auth()->user()->hasPermission('canviewmyprojects')) {
            return redirect()->route('pages.unauthorized')->with('unauthorizationmessage', "You are not Authorized to view your Projects!");
        }

        $userid = auth()->user()->userid;

        // Fetch projects where the related proposals' useridfk matches the current user
        $myprojects = ResearchProject::with('proposal')
            ->whereHas('proposal', function ($query) use ($userid) {
                $query->where('useridfk', $userid);
            })
            ->with('proposal')
            ->with('applicant')
            ->get();
        // Return the view with the necessary data
        return response()->json($myprojects);
    }
    public function viewmyproject($id)
    {

        // Fetch projects where the related proposals' useridfk matches the current user
        $project = ResearchProject::with(['proposal.applicant'])->findOrFail($id);
        //  ;
        // Return the view with the necessary data
        return view('pages.projects.viewproject', compact('project'));
    }

    public function allprojects()
    {
        if (!auth()->user()->hasPermission('canviewallprojects')) {
            return redirect()->route('pages.unauthorized')->with('unauthorizationmessage', "You are not Authorized to view all Projects!");
        }
        // Return the view with the necessary data
        return view('pages.projects.allprojects');
    }

    public function fetchallactiveprojects()
    {
        if (!auth()->user()->hasPermission('canviewallprojects')) {
            return redirect()->route('pages.unauthorized')->with('unauthorizationmessage', "You are not Authorized to view all Projects!");
        }

        $allprojects = ResearchProject::where('projectstatus', 'Active')
            ->with('proposal')
            ->with('applicant')
            ->get();
        return response()->json($allprojects);
    }

    public function fetchallprojects()
    {
        if (!auth()->user()->hasPermission('canviewallprojects')) {
            return redirect()->route('pages.unauthorized')->with('unauthorizationmessage', "You are not Authorized to view all Projects!");
        }

        // Fetch projects where the related proposals' useridfk matches the current user
        $allprojects = ResearchProject::with('proposal')
            ->with('applicant')
            ->get();
        return response()->json($allprojects);
    }

    public function fetchsearchallprojects(Request $request)
    {
        if (!auth()->user()->hasPermission('canviewallprojects')) {
            return response()->json([]);
        }

        $searchTerm = $request->input('search');

        // Fetch projects where the applicant's name or project status matches the search term
        $allprojects = ResearchProject::with(['proposal', 'applicant'])
            ->whereHas('applicant', function ($query) use ($searchTerm) {
                $query->where('name', 'like', '%' . $searchTerm . '%');
            })
            ->orWhere('projectstatus', 'like', '%' . $searchTerm . '%')
            ->get();

        return response()->json($allprojects);
    }

    public function viewanyproject($id)
    {
        if (!auth()->user()->hasPermission('canreadanyproject')) {
            return redirect()->route('pages.unauthorized')->with('unauthorizationmessage', "You are not Authorized to view this Project!");
        }

        // Fetch projects where the related proposals' useridfk matches the current user
        $project = ResearchProject::with(['proposal.applicant', 'mandeperson'])->findOrFail($id);
        $allusers = User::all();
        //  ;
        // Return the view with the necessary data
        return view('pages.projects.viewproject', compact('project', 'allusers'));
    }

    public function submitmyprogress(Request $request, $id)
    {
        $project = ResearchProject::with(['proposal.applicant'])->findOrFail($id);
        if (auth()->user()->userid != $project->applicant->userid) {
            return redirect()->route('pages.unauthorized')->with('unauthorizationmessage', "You are not the owner of this Project!");
        }
        // Validate incoming request data if needed
        // Define validation rules
        $rules = [
            'report' => 'required|string', // Example rules, adjust as needed
            'researchidfk' => 'required|string',
            'reportedbyfk' => 'required|string',
        ];



        // Validate incoming request
        $validator = Validator::make($request->all(), $rules);

        // Check if validation fails
        if ($validator->fails()) {
            // return response()->json(['error' => $validator->errors()], 400);
            return response(['message' => 'Fill all the required Fields!', 'type' => 'danger'], 400);

        }
        $project = ResearchProject::with('applicant')->findOrFail($id);
        $item = new ResearchProgress();
        $item->researchidfk = $request->input('researchidfk');
        $item->reportedbyfk = $request->input('reportedbyfk');
        $item->report = $request->input('report');
        $item->save();
        //notify
        $mailingController = new MailingController();
        $url = route('pages.projects.viewanyproject', ['id' => $item->researchidfk]);
        $mailingController->notifyUsersOfProposalActivity('projectprogressreport', 'Project Progress!', 'success', ['Researcher ' . $project->applicant->name . ' has  Submitted his/her progress for this Project.', 'Project Refference : ' . $project->researchnumber], 'View Project', $url);

        // Optionally, return a response or redirect
        return response(['message' => 'Report Submitted Successfully!!', 'type' => 'success']);


    }
    public function assignme(Request $request, $id)
    {
        if (!auth()->user()->hasPermission('canassignmonitoringperson')) {
            return redirect()->route('pages.unauthorized')->with('unauthorizationmessage', "You are not authorized to Assign M & E!");
        }
        $rules = [
            'supervisorfk' => 'required|string',
        ];



        // Validate incoming request
        $validator = Validator::make($request->all(), $rules);

        // Check if validation fails
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $item = ResearchProject::findOrFail($id);

        $item->supervisorfk = $request->input('supervisorfk');
        $item->save();
        $mailingController = new MailingController();
        $url = route('pages.projects.viewanyproject', ['id' => $item->researchid]);
        $mailingController->notifyUsersOfProposalActivity('projectassignedmande', 'Project Monitoring Assignment!', 'success', ['This Project has been assigned M & E Team.'], 'View Project', $url);

        // Optionally, return a response or redirect
        return redirect(route('pages.projects.viewanyproject', ['id' => $id]));


    }
    public function pauseproject(Request $request, $id)
    {
        if (!auth()->user()->hasPermission('canpauseresearchproject')) {
            return redirect()->route('pages.unauthorized')->with('unauthorizationmessage', "You are not authorized to pause this Project!");
        }

        $item = ResearchProject::findOrFail($id);

        if ($item->ispaused) {
            return redirect()->back()->with('projectalreadypausedmessage', 'This Project has already been Paused!');
        }
        $item->ispaused = true;
        $item->save();
        $mailingController = new MailingController();
        $url = route('pages.projects.viewanyproject', ['id' => $item->researchid]);
        $mailingController->notifyUsersOfProposalActivity('projectpaused', 'Project Paused!', 'success', ['This Project has been Paused Successfully.'], 'View Project', $url);

        // Optionally, return a response or redirect
        return redirect(route('pages.projects.viewanyproject', ['id' => $id]));


    }
    public function resumeproject(Request $request, $id)
    {
        if (!auth()->user()->hasPermission('canresumeresearchproject')) {
            return redirect()->route('pages.unauthorized')->with('unauthorizationmessage', "You are not authorized to pause this Project!");
        }

        $item = ResearchProject::findOrFail($id);
        if (!$item->ispaused) {
            return redirect()->back()->with('projectnotpausedmessage', 'This Project cannot Resume because its not Paused!');
        }
        $item->ispaused = false;
        $item->save();

        $mailingController = new MailingController();
        $url = route('pages.projects.viewanyproject', ['id' => $item->researchid]);
        $mailingController->notifyUsersOfProposalActivity('projectpaused', 'Project Paused!', 'success', ['This Project has been Paused Successfully.'], 'View Project', $url);

        // Optionally, return a response or redirect
        return redirect(route('pages.projects.viewanyproject', ['id' => $id]));


    }
    public function cancelproject(Request $request, $id)
    {
        if (!auth()->user()->hasPermission('cancancelresearchproject')) {
            return redirect()->route('pages.unauthorized')->with('unauthorizationmessage', "You are not authorized to pause this Project!");
        }
        $item = ResearchProject::findOrFail($id);

        if ($item->projectstatus != 'Active') {
            return redirect()->back()->with('projectnotcancelledmessage', 'This Project cannot be Cancelled because its not Active!');
        }
        $item->projectstatus = 'Cancelled';
        $item->save();
        $mailingController = new MailingController();
        $url = route('pages.projects.viewanyproject', ['id' => $item->researchid]);
        $mailingController->notifyUsersOfProposalActivity('projectcancelled', 'Project Cancelled!', 'success', ['This Project has been Cancelled and Stopped Successfully.'], 'View Project', $url);

        // Optionally, return a response or redirect
        return redirect(route('pages.projects.viewanyproject', ['id' => $id]));
    }
    public function completeproject(Request $request, $id)
    {
        if (!auth()->user()->hasPermission('cancompleteresearchproject')) {
            return redirect()->route('pages.unauthorized')->with('unauthorizationmessage', "You are not authorized to pause this Project!");
        }

        $item = ResearchProject::findOrFail($id);

        if ($item->projectstatus != 'Active' || $item->ispaused) {
            return redirect()->back()->with('projectnotcompletedmessage', 'This Project cannot be Completed because its not Active or it has been Paused!');
        }
        $item->projectstatus = 'Completed';
        $item->save();

        $mailingController = new MailingController();
        $url = route('pages.projects.viewanyproject', ['id' => $item->researchid]);
        $mailingController->notifyUsersOfProposalActivity('projectcompleted', 'Project Completed!', 'success', ['This Project has been Completed and Closed Successfully.'], 'View Project', $url);

        // Optionally, return a response or redirect
        return redirect(route('pages.projects.viewanyproject', ['id' => $id]))->with('projectcompletedmessage', 'This Project has been Completed and Closed Successfully!');
    }
    public function fetchprojectprogress($id)
    {
        // Fetch projects where the related proposals' useridfk matches the current user
        $progresshistory = ResearchProgress::where('researchidfk', $id)->get();
        return response()->json($progresshistory);
    }

    public function addfunding(Request $request, $id)
    {
        if (!auth()->user()->hasPermission('canaddprojectfunding')) {
            return redirect()->route('pages.unauthorized')->with('unauthorizationmessage', "You are not Authorized to Add funds to this Project!");
        }

        // Validate incoming request data if needed
        // Define validation rules
        $rules = [
            'amount' => 'required|int',
        ];

        // Validate incoming request
        $validator = Validator::make($request->all(), $rules);

        // Check if validation fails
        if ($validator->fails()) {
            // return response()->json(['error' => $validator->errors()], 400);
            return response(['message' => 'Fill all the required Fields!', 'type' => 'danger'], 400);

        }
        $tranches = ResearchFunding::where('researchidfk', $id)->count();
        if ($tranches >= 3) {                
            return response(['message' => 'This Project has reached the Maximum number of Funding Tranches!', 'type' => 'danger']);

        }
        $project = ResearchProject::with('proposal')->findOrFail($id);
        $commencingDate = Carbon::parse($project->proposal->commencingdate);
        if ($tranches == 1) {
            $commencingDatePlusSixMonths = $commencingDate->addMonths(6);
            if (Carbon::now()->isBefore($commencingDatePlusSixMonths)) {
                return response(['message' => 'You must wait until [' . $commencingDatePlusSixMonths->toDateString() . '] to get the second Tranch of Funding!', 'type' => 'danger']);
            }
        }
        if ($tranches == 2) {
            $commencingDatePlusNineMonths = $commencingDate->addMonths(9);
            if (Carbon::now()->isBefore($commencingDatePlusNineMonths)) {
                return response(['message' => 'You must wait until [' . $commencingDatePlusNineMonths->toDateString() . '] to get the Third Tranch of Funding!', 'type' => 'danger']);
            }
        }
        $item = new ResearchFunding();
        $item->researchidfk = $id;
        $item->createdby = Auth::user()->userid;
        $item->amount = $request->input('amount');
        $item->save();

        $mailingController = new MailingController();
        $url = route('pages.projects.viewanyproject', ['id' => $id]);
        $mailingController->notifyUsersOfProposalActivity('projectdfundingreleased', 'Project Funding Released!', 'success', ['This Project has received a funding of Ksh ' . $request->input('amount') . ', Dispatched by ' . auth()->user()->name], 'View Project', $url);

        // Optionally, return a response or redirect
        return response(['message' => 'Funding Release Submitted Successfully!!', 'type' => 'success']);


    }

    public function fetchprojectfunding($id)
    {
        $project = ResearchProject::with(['applicant'])->findOrFail($id);

        if (!auth()->user()->hasPermission('canviewprojectfunding') && $project->applicant->userid != auth()->user()->userid) {
            return redirect()->route('pages.unauthorized')->with('unauthorizationmessage', "You are not Authorized to view this Project Funding!");
        }
        // Fetch projects where the related proposals' useridfk matches the current user
        $fundings = ResearchFunding::with('applicant')->where('researchidfk', $id)->get();
        $total = $fundings->sum('amount');
        $result = [
            'total' => $total,
            'fundingrows' => $fundings->count(),
            'fundingrecords' => $fundings,
        ];
        return response()->json($result);
    }
}
