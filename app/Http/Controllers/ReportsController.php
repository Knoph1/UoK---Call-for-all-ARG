<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Grant;
use App\Models\Proposal;
use App\Models\ResearchTheme;
use Illuminate\Http\Request;

class ReportsController extends Controller
{
    //return reports main view
    public function home()
    {
        if (!auth()->user()->haspermission('canviewreports')) {
            return redirect()->route('pages.unauthorized')->with('unauthorizationmessage', "You are not Authorized to View Reports!");
        }
        $allgrants = Grant::all();
        $allthemes = ResearchTheme::all();
        $alldepartments = Department::all();
        return view('pages.reports.home', compact('allgrants', 'allthemes', 'alldepartments'));
    }

    public function getallproposals(Request $request)
    {
        if (!auth()->user()->haspermission('canviewallapplications')) {
            return redirect()->route('pages.unauthorized')->with('unauthorizationmessage', "You are not Authorized to view all Proposals!");
        }
        $searchTerm = $request->input('search');
        if ($searchTerm != null) {
            $data = Proposal::with('department', 'grantitem', 'themeitem', 'applicant')
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
        } else {
            $data = Proposal::with('department', 'grantitem', 'themeitem', 'applicant')->get();
        }
        return response()->json($data); // Return filtered data as JSON
    }
    public function c(Request $request)
    {
        if (!auth()->user()->haspermission('canviewallapplications')) {
            return redirect()->route('pages.unauthorized')->with('unauthorizationmessage', "You are not Authorized to view all Proposals!");
        }
        $grantfilter = $request->input('filtergrant');
        $themefilter = $request->input('filtertheme');
        $data = Proposal::with('department', 'grantitem', 'themeitem', 'applicant');
        //filter grant
        if ($grantfilter != null) {
            $data = $data->orWhereHas('grantitem', function ($query) use ($grantfilter) {
                $query->where('grantid', $grantfilter);
            });
        }
        //filter theme
        if ($themefilter != null) {
            $data = $data->orWhereHas('themeitem', function ($query) use ($themefilter) {
                $query->where('themeid', $themefilter);
            });
        }
        //get all departments
        $departments = Department::all();
        $departmentProposals[] = ['Name', 'Total', 'Male', 'Female'];
        // Loop through each department
        foreach ($departments as $department) {
            // Get the proposals for the current department
            $proposals = $data->where('departmentidfk', $department->depid)->get();
            //proposal status
            $approved = $proposals->where('approvalstatus', 'Approved')->count();
            $rejected = $proposals->where('approvalstatus', 'Rejected')->count();
            $pending = $proposals->where('approvalstatus', 'Pending')->count();
            // gender
            $malecount = $proposals->filter(function ($proposal) {
                return $proposal->applicant->gender === 'Male';
            })->count();
            $femalecount = $proposals->filter(function ($proposal) {
                return $proposal->applicant->gender === 'Female';
            })->count();

            // Add the department and its proposals to the array
            $departmentProposals[] = [$department->shortname, $proposals->count(), $malecount, $femalecount];
            // 'statuses' => ['Approved' => $approved, 'Rejected' => $rejected, 'Pending' => $pending]

        }
        return response()->json($departmentProposals); // Return filtered data as JSON
    }
    public function getProposalsBySchool(Request $request)
    {
        if (!auth()->user()->hasPermission('canViewAllApplications')) {
            return redirect()->route('pages.unauthorized')
                ->with('unauthorizationmessage', "You are not Authorized to view all Proposals!");
        }

        $grantFilter = $request->input('filtergrant');
        $themeFilter = $request->input('filtertheme');

        $proposalsQuery = Proposal::with('department', 'grantitem', 'themeitem', 'applicant');

        // Filter by grant
        if ($grantFilter && $grantFilter != 'all') {
            $proposalsQuery->whereHas('grantitem', function ($query) use ($grantFilter) {
                $query->where('grantid', $grantFilter);
            });
        }

        // Filter by theme
        if ($themeFilter && $themeFilter != 'all') {
            $proposalsQuery->whereHas('themeitem', function ($query) use ($themeFilter) {
                $query->where('themeid', $themeFilter);
            });
        }

        $departments = Department::all();
        $chartData = [
            'labels' => [],
            'datasets' => [
                [
                    'label' => 'Total Proposals',
                    'backgroundColor' => 'rgba(17, 126, 73, 1)',
                    'borderColor' => 'rgba(54, 162, 235, 1)',
                    'borderWidth' => 1,
                    'data' => []
                ],
                [
                    'label' => 'Male Applicants',
                    'backgroundColor' => 'rgba(236, 141, 87, 1)',
                    'borderColor' => 'rgba(75, 192, 192, 1)',
                    'borderWidth' => 1,
                    'data' => []
                ],
                [
                    'label' => 'Female Applicants',
                    'backgroundColor' => 'rgba(236, 87, 182, 1)',
                    'borderColor' => 'rgba(255, 99, 132, 1)',
                    'borderWidth' => 1,
                    'data' => []
                ],
                [
                    'label' => 'Approved Proposals',
                    'backgroundColor' => 'rgba(87, 148, 236, 1)',
                    'borderColor' => 'rgba(75, 192, 192, 1)',
                    'borderWidth' => 1,
                    'data' => []
                ],
                [
                    'label' => 'Rejected Proposals',
                    'backgroundColor' => 'rgba(207, 210, 101, 1)',
                    'borderColor' => 'rgba(255, 99, 132, 1)',
                    'borderWidth' => 1,
                    'data' => []
                ],
                [
                    'label' => 'Pending Proposals',
                    'backgroundColor' => 'rgba(101, 173, 45, 0.47)',
                    'borderColor' => 'rgba(255, 99, 132, 1)',
                    'borderWidth' => 1,
                    'data' => []
                ]
            ]
        ];

        foreach ($departments as $department) {
            $filteredProposals = (clone $proposalsQuery)->where('departmentidfk', $department->depid)->get();

            $approvedCount = $filteredProposals->where('approvalstatus', 'Approved')->count();
            $rejectedCount = $filteredProposals->where('approvalstatus', 'Rejected')->count();
            $pendingCount = $filteredProposals->where('approvalstatus', 'Pending')->count();

            $maleCount = $filteredProposals->filter(fn($proposal) => $proposal->applicant->gender === 'Male')->count();
            $femaleCount = $filteredProposals->filter(fn($proposal) => $proposal->applicant->gender === 'Female')->count();

            $chartData['labels'][] = $department->shortname;

            $chartData['datasets'][0]['data'][] = $filteredProposals->count();
            $chartData['datasets'][1]['data'][] = $maleCount;
            $chartData['datasets'][2]['data'][] = $femaleCount;
            $chartData['datasets'][3]['data'][] = $approvedCount;
            $chartData['datasets'][4]['data'][] = $rejectedCount;
            $chartData['datasets'][5]['data'][] = $pendingCount;
        }

        return response()->json($chartData);
    }

    public function getProposalsByTheme(Request $request)
    {
        if (!auth()->user()->hasPermission('canViewAllApplications')) {
            return redirect()->route('pages.unauthorized')
                ->with('unauthorizationmessage', "You are not Authorized to view all Proposals!");
        }

        $grantFilter = $request->input('filtergrant');
        $departmentFilter = $request->input('filterdepartment');

        $proposalsQuery = Proposal::with('department', 'grantitem', 'themeitem', 'applicant');

        // Filter by grant
        if ($grantFilter && $grantFilter != 'all') {
            $proposalsQuery->whereHas('grantitem', function ($query) use ($grantFilter) {
                $query->where('grantid', $grantFilter);
            });
        }

        // Filter by department
        if ($departmentFilter && $departmentFilter != 'all') {
            $proposalsQuery->whereHas('department', function ($query) use ($departmentFilter) {
                $query->where('depid', $departmentFilter);
            });
        }

        $themes = ResearchTheme::all();
        $chartData = [
            'labels' => [],
            'datasets' => [
                [
                    'label' => 'Total Proposals',
                    'backgroundColor' => 'rgba(17, 126, 73, 1)',
                    'borderColor' => 'rgba(54, 162, 235, 1)',
                    'borderWidth' => 1,
                    'data' => []
                ],
                [
                    'label' => 'Male Applicants',
                    'backgroundColor' => 'rgba(236, 141, 87, 1)',
                    'borderColor' => 'rgba(75, 192, 192, 1)',
                    'borderWidth' => 1,
                    'data' => []
                ],
                [
                    'label' => 'Female Applicants',
                    'backgroundColor' => 'rgba(236, 87, 182, 1)',
                    'borderColor' => 'rgba(255, 99, 132, 1)',
                    'borderWidth' => 1,
                    'data' => []
                ],
                [
                    'label' => 'Approved Proposals',
                    'backgroundColor' => 'rgba(87, 148, 236, 1)',
                    'borderColor' => 'rgba(75, 192, 192, 1)',
                    'borderWidth' => 1,
                    'data' => []
                ],
                [
                    'label' => 'Rejected Proposals',
                    'backgroundColor' => 'rgba(207, 210, 101, 1)',
                    'borderColor' => 'rgba(255, 99, 132, 1)',
                    'borderWidth' => 1,
                    'data' => []
                ],
                [
                    'label' => 'Pending Proposals',
                    'backgroundColor' => 'rgba(101, 173, 45, 0.47)',
                    'borderColor' => 'rgba(255, 99, 132, 1)',
                    'borderWidth' => 1,
                    'data' => []
                ]
            ]
        ];

        foreach ($themes as $theme) {
            $filteredProposals = (clone $proposalsQuery)->where('themefk', $theme->themeid)->get();

            $approvedCount = $filteredProposals->where('approvalstatus', 'Approved')->count();
            $rejectedCount = $filteredProposals->where('approvalstatus', 'Rejected')->count();
            $pendingCount = $filteredProposals->where('approvalstatus', 'Pending')->count();

            $maleCount = $filteredProposals->filter(fn($proposal) => $proposal->applicant->gender == 'Male')->count();
            $femaleCount = $filteredProposals->filter(fn($proposal) => $proposal->applicant->gender == 'Female')->count();

            $chartData['labels'][] = $theme->themename;

            $chartData['datasets'][0]['data'][] = $filteredProposals->count();
            $chartData['datasets'][1]['data'][] = $maleCount;
            $chartData['datasets'][2]['data'][] = $femaleCount;
            $chartData['datasets'][3]['data'][] = $approvedCount;
            $chartData['datasets'][4]['data'][] = $rejectedCount;
            $chartData['datasets'][5]['data'][] = $pendingCount;
        }

        return response()->json($chartData);
    }

    public function getProposalsByGrant(Request $request)
    {
        if (!auth()->user()->hasPermission('canViewAllApplications')) {
            return redirect()->route('pages.unauthorized')
                ->with('unauthorizationmessage', "You are not Authorized to view all Proposals!");
        }

        $themeFilter = $request->input('filtertheme');
        $departmentFilter = $request->input('filterdepartment');

        $proposalsQuery = Proposal::with('department', 'grantitem', 'themeitem', 'applicant');

        // Filter by grant
        if ($themeFilter && $themeFilter != 'all') {
            $proposalsQuery->whereHas('themeitem', function ($query) use ($themeFilter) {
                $query->where('themeid', $themeFilter);
            });
        }

        // Filter by department
        if ($departmentFilter && $departmentFilter != 'all') {
            $proposalsQuery->whereHas('department', function ($query) use ($departmentFilter) {
                $query->where('depid', $departmentFilter);
            });
        }

        $grants = Grant::all();
        $chartData = [
            'labels' => [],
            'datasets' => [
                [
                    'label' => 'Total Proposals',
                    'backgroundColor' => 'rgba(17, 126, 73, 1)',
                    'borderColor' => 'rgba(54, 162, 235, 1)',
                    'borderWidth' => 1,
                    'data' => []
                ],
                [
                    'label' => 'Male Applicants',
                    'backgroundColor' => 'rgba(236, 141, 87, 1)',
                    'borderColor' => 'rgba(75, 192, 192, 1)',
                    'borderWidth' => 1,
                    'data' => []
                ],
                [
                    'label' => 'Female Applicants',
                    'backgroundColor' => 'rgba(236, 87, 182, 1)',
                    'borderColor' => 'rgba(255, 99, 132, 1)',
                    'borderWidth' => 1,
                    'data' => []
                ],
                [
                    'label' => 'Approved Proposals',
                    'backgroundColor' => 'rgba(87, 148, 236, 1)',
                    'borderColor' => 'rgba(75, 192, 192, 1)',
                    'borderWidth' => 1,
                    'data' => []
                ],
                [
                    'label' => 'Rejected Proposals',
                    'backgroundColor' => 'rgba(207, 210, 101, 1)',
                    'borderColor' => 'rgba(255, 99, 132, 1)',
                    'borderWidth' => 1,
                    'data' => []
                ],
                [
                    'label' => 'Pending Proposals',
                    'backgroundColor' => 'rgba(101, 173, 45, 0.47)',
                    'borderColor' => 'rgba(255, 99, 132, 1)',
                    'borderWidth' => 1,
                    'data' => []
                ]
            ]
        ];

        foreach ($grants as $grant) {
            $filteredProposals = (clone $proposalsQuery)->where('grantnofk', $grant->grantid)->get();

            $approvedCount = $filteredProposals->where('approvalstatus', 'Approved')->count();
            $rejectedCount = $filteredProposals->where('approvalstatus', 'Rejected')->count();
            $pendingCount = $filteredProposals->where('approvalstatus', 'Pending')->count();

            $maleCount = $filteredProposals->filter(fn($proposal) => $proposal->applicant->gender == 'Male')->count();
            $femaleCount = $filteredProposals->filter(fn($proposal) => $proposal->applicant->gender == 'Female')->count();

            $chartData['labels'][] = $grant->grantid . '(' . $grant->finyear . ')';

            $chartData['datasets'][0]['data'][] = $filteredProposals->count();
            $chartData['datasets'][1]['data'][] = $maleCount;
            $chartData['datasets'][2]['data'][] = $femaleCount;
            $chartData['datasets'][3]['data'][] = $approvedCount;
            $chartData['datasets'][4]['data'][] = $rejectedCount;
            $chartData['datasets'][5]['data'][] = $pendingCount;
        }

        return response()->json($chartData);
    }

}
