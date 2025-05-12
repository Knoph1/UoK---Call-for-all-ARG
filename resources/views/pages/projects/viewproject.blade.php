@extends('layouts.master')

@section('content')
@auth


    @if (isset($project))
        <div>
            <style>
                .prop-tabcontainer {
                    background-color: #FAF9F6;
                    border-radius: 4px;
                }

                .prop-tabpanel {
                    border-width: 1px;
                    border-color: gray;
                    background-color: #FAF9F6;
                    border-style: solid;
                    border-radius: 4px;
                    padding: 8px;
                }

                .form-group {
                    margin-bottom: 6px;
                }
            </style>
            @if (session('projectalreadypausedmessage'))
                <script>
                    $(document).ready(function () {
                        showtoastmessage({ 'message': "{{session('projectalreadypausedmessage')}}" });
                    });
                </script>
            @endif

            @if (session('projectnotpausedmessage'))
                <script>
                    $(document).ready(function () {
                        showtoastmessage({ 'message': "{{session('projectnotpausedmessage')}}" });
                    });
                </script>
            @endif

            @if (session('projectnotcancelledmessage'))
                <script>
                    $(document).ready(function () {
                        showtoastmessage({ 'message': "{{session('projectnotcancelledmessage')}}" });
                    });
                </script>
            @endif

            @if (session('projectnotcompletedmessage'))
                <script>
                    $(document).ready(function () {
                        showtoastmessage({ 'message': "{{session('projectnotcompletedmessage')}}" });
                    });
                </script>
            @endif

            @if (session('projectcompletedmessage'))
                <script>
                    $(document).ready(function () {
                        showtoastmessage({ 'message': "{{session('projectcompletedmessage')}}" });
                    });
                </script>
            @endif

            @if (session('projectfundinglimit'))
                <script>
                    $(document).ready(function () {
                        showtoastmessage({ 'message': "{{session('projectfundinglimit')}}" });
                    });
                </script>
            @endif

            <div class="prop-tabcontainer">
                <!-- Nav tabs -->
                <nav>
                    <div class="nav nav-tabs" id="nav-tab" role="tablist">
                        <button class="nav-link active" id="nav-researchinfo-tab" data-bs-toggle="tab"
                            data-bs-target="#panel-researchinfo" type="button" role="tab" aria-controls="panel-researchinfo"
                            aria-selected="true">Research Info</button>
                        <button class="nav-link" id="nav-researchprogress-tab" data-bs-toggle="tab"
                            data-bs-target="#panel-researchprogress" type="button" role="tab"
                            aria-controls="panel-researchprogress" aria-selected="false">Progress</button>
                        <button class="nav-link" id="nav-funding-tab" data-bs-toggle="tab" data-bs-target="#panel-funding"
                            type="button" role="tab" aria-controls="panel-funding" aria-selected="false">Funding</button>
                    </div>
                </nav>

                <!-- Tab panes -->
                <div class="tab-content prop-tabpanel">

                    <!-- researchinfo Details -->
                    <div role="tabpanel" class="tab-pane active" id="panel-researchinfo">
                        <div>
                            <form method="POST" id="basicdetails" enctype="multipart/form-data" class="form-horizontal">
                                @csrf
                                <div class="row form-group">
                                    <div class="col col-md-3">
                                        <label class="form-control-label">Research No</label>
                                    </div>
                                    <div class="col-12 col-md-9">
                                        <input type="text" value="{{$project->researchnumber}}" class="form-control" readonly>
                                    </div>
                                </div>
                                <div class="row form-group">
                                    <div class="col col-md-3">
                                        <label class="form-control-label">Full Name</label>
                                    </div>
                                    <div class="col-12 col-md-9">
                                        <input type="text" value="{{$project->applicant->name}}" class="form-control" readonly>
                                    </div>
                                </div>

                                <div class="row form-group">
                                    <div class="col col-md-3">
                                        <label class="form-control-label">Research Title</label>
                                    </div>
                                    <div class="col-12 col-md-9">
                                        <input type="text" value="{{ $project->proposal->researchtitle}}" class="form-control"
                                            readonly>
                                    </div>
                                </div>

                                <div class="row form-group">
                                    <div class="col col-md-3">
                                        <label class="form-control-label">Hypothesis</label>
                                    </div>
                                    <div class="col-12 col-md-9">
                                        <input type="text" id="pfnofk" name="pfnofk" placeholder="Your PF Number"
                                            value="{{$project->proposal->hypothesis }}" class="form-control" readonly>
                                    </div>
                                </div>

                            </form>
                        </div>
                        <script>

                            $(document).ready(function () {



                                // Function to fetch data using AJAX
                                function fetchData() {
                                    $.ajax({
                                        url: "{{ route('api.users.fetchallusers') }}",
                                        type: 'GET',
                                        dataType: 'json',
                                        success: function (response) {
                                            populateTable(response);
                                        },
                                        error: function (xhr, status, error) {
                                            console.error('Error fetching data:', error);
                                        }
                                    });
                                }

                                // Function to search data using AJAX
                                function searchData(searchTerm) {
                                    $.ajax({
                                        url: "{{ route('api.users.fetchsearchusers') }}",
                                        type: 'GET',
                                        dataType: 'json',
                                        data: {
                                            search: searchTerm
                                        },
                                        success: function (response) {

                                            populateTable(response);
                                        },
                                        error: function (xhr, status, error) {
                                            console.error('Error searching data:', error);
                                        }
                                    });
                                }
                                var routeUrlTemplate = "{{ route('pages.users.viewsingleuser', ['id' => '__ID__']) }}";

                                // Function to populate table with data
                                function populateTable(data) {
                                    var tbody = $('#proposalstable tbody');
                                    tbody.empty(); // Clear existing table rows
                                    if (data.length > 0) {
                                        $.each(data, function (index, data) {
                                            var userurl = routeUrlTemplate.replace('__ID__', data.userid);
                                            var row = '<tr>' +
                                                '<td>' + data.name + '</td>' +
                                                (canviewuser ? '<td><a class="nav-link pt-0 pb-0" href="' + userurl + '">' + data.email + '</a></td>' : '<td>' + data.email + '</td>') +
                                                '<td>' + data.pfno + '</td>' +
                                                '<td>' + Boolean(data.isactive) + '</td>' +
                                                '<td>' + data.role + '</td>' +
                                                '<td>' + new Date(data.created_at).toDateString("en-US") + '</td>' +
                                                '</tr>';
                                            tbody.append(row);
                                        });
                                    }
                                    else {
                                        var row = '<tr><td colspan="5">No Users found</td></tr>';
                                        tbody.append(row);
                                    }
                                }
                                // Initial fetch when the page loads
                                fetchData();

                                // Search input keyup event
                                $('#searchInput').on('keyup', function () {
                                    var searchTerm = $(this).val().toLowerCase();
                                    if (searchTerm.length >= 3) { // Optional: adjust the minimum search term length
                                        searchData(searchTerm);
                                    } else if (searchTerm.length === 0) {
                                        fetchData(); // Fetch all data when search input is empty
                                    }
                                });
                            });
                        </script>
                    </div>

                    <!-- researchprogress tab -->
                    <div role="tabpanel" class="tab-pane" id="panel-researchprogress">
                        <div>
                            <div class="row form-group">
                                @if (auth()->user()->userid == $project->applicant->userid)
                                    <div class="col text-center">
                                        <button id="btn_submitreport" type="button" class="btn btn-info " data-bs-toggle="modal"
                                            data-bs-target="#addresearchprogressmodal">Submit Report
                                        </button>
                                    </div>
                                @endif


                                @if (auth()->user()->haspermission('canpauseresearchproject') && $project->projectstatus == 'Active' && $project->ispaused == false)
                                    <div class="col text-center">
                                        <button id="btn_pauseproject" type="button" class="btn btn-info " data-bs-toggle="modal"
                                            data-bs-target="#pauseprojectmodal">Pause Project
                                        </button>
                                    </div>
                                @endif


                                @if (auth()->user()->haspermission('canassignmonitoringperson') && $project->projectstatus == 'Active' && $project->ispaused == false)
                                    <div class="col text-center">
                                        <button id="btn_assignmande" type="button" class="btn btn-info " data-bs-toggle="modal"
                                            data-bs-target="#assignmandemodal">Assign M&E
                                        </button>
                                    </div>
                                @endif


                                @if (auth()->user()->haspermission('canresumeresearchproject') && $project->projectstatus == 'Active' && $project->ispaused == true)
                                    <div class="col text-center">
                                        <button id="btn_resumeproject" type="button" class="btn btn-info " data-bs-toggle="modal"
                                            data-bs-target="#resumeprojectmodal">Resume Project</button>
                                    </div>
                                @endif


                                @if (auth()->user()->haspermission('cancancelresearchproject'))
                                    <div class="col text-center">
                                        <button id="btn_cancelproject" type="button" class="btn btn-danger " data-bs-toggle="modal"
                                            data-bs-target="#cancelprojectmodal">Cancel Project</button>
                                    </div>
                                @endif


                                @if (auth()->user()->haspermission('cancompleteresearchproject'))
                                    <div class="col text-center">
                                        <button id="btn_completeproject" type="button" class="btn btn-success "
                                            data-bs-toggle="modal" data-bs-target="#completeprojectmodal">Complete</button>
                                    </div>
                                @endif



                            </div>
                            <!-- modals div -->
                            <div>
                                <!--add progress Modal -->
                                <div class="modal fade" id="addresearchprogressmodal" data-bs-backdrop="static"
                                    data-bs-keyboard="false" tabindex="-1" aria-labelledby="researchprogressmodalLabel"
                                    aria-hidden="true">
                                    <div class="modal-dialog">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title" id="researchprogressmodalLabel">Research Progress</h5>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                                    aria-label="Close"></button>
                                            </div>
                                            <div class="modal-body">
                                                <form id="form_researchprogress" method="POST">
                                                    @csrf
                                                    <div class="row form-group">
                                                        <div class="col col-md-3">
                                                            <label class="form-control-label">Report</label>
                                                        </div>
                                                        <div class="col-12 col-md-9">
                                                            <textarea name="report" placeholder="Progress Report"
                                                                class="form-control" rows="5"></textarea>
                                                        </div>
                                                    </div>

                                                </form>
                                            </div>
                                            <div class="modal-footer">
                                                <button id="btn_closeprogressmodal" type="button" class="btn btn-secondary"
                                                    data-bs-dismiss="modal">Close</button>
                                                <button id="btn_saveprogress" type="button" class="btn btn-primary">Save
                                                    Progress</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!--pause project Modal -->
                                <div class="modal fade" id="pauseprojectmodal" data-bs-backdrop="static"
                                    data-bs-keyboard="false" tabindex="-1" aria-labelledby="pauseprojectmodalLabel"
                                    aria-hidden="true">
                                    <div class="modal-dialog">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title" id="pauseprojectmodalLabel">Pause Project</h5>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                                    aria-label="Close"></button>
                                            </div>
                                            <div class="modal-body">
                                                Are you sure you want to Pause the Project?
                                            </div>
                                            <div class="modal-footer">
                                                <button id="btn_closepauseprojectmodal" type="button" class="btn btn-secondary"
                                                    data-bs-dismiss="modal">Close</button>
                                                <form id="form_pauseproject" method="POST"
                                                    action="{{ route('api.projects.pauseproject', ['id' => $project->researchid]) }}">
                                                    @csrf
                                                    <button id="btn_savepauseproject" type="submit"
                                                        class="btn btn-primary">Pause Project</button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!--resume project Modal -->
                                <div class="modal fade" id="resumeprojectmodal" data-bs-backdrop="static"
                                    data-bs-keyboard="false" tabindex="-1" aria-labelledby="resumeprojectmodalLabel"
                                    aria-hidden="true">
                                    <div class="modal-dialog">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title" id="resumeprojectmodalLabel">Resume Project</h5>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                                    aria-label="Close"></button>
                                            </div>
                                            <div class="modal-body">
                                                Are you sure you want to Resume the Project?
                                            </div>
                                            <div class="modal-footer">
                                                <button id="btn_closeresumeprojectmodal" type="button" class="btn btn-secondary"
                                                    data-bs-dismiss="modal">Close</button>
                                                <form id="form_resumeproject" method="POST"
                                                    action="{{ route('api.projects.resumeproject', ['id' => $project->researchid]) }}">
                                                    @csrf
                                                    <button id="btn_saveresumeproject" type="submit"
                                                        class="btn btn-primary">Resume Project</button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!--assign m and e team Modal -->
                                <div class="modal fade" id="assignmandemodal" data-bs-backdrop="static" data-bs-keyboard="false"
                                    tabindex="-1" aria-labelledby="mandemodalLabel" aria-hidden="true">
                                    <div class="modal-dialog">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title" id="mandemodalLabel">Assign M & E</h5>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                                    aria-label="Close"></button>
                                            </div>
                                            <div class="modal-body">
                                                <form id="form_assignmande"
                                                    action="{{ route('api.projects.assignme', ['id' => $project->researchid])}}"
                                                    method="POST">
                                                    @csrf
                                                    <div class="row form-group">
                                                        <div class="col col-md-3">
                                                            <label class="form-control-label">Current M&E</label>
                                                        </div>
                                                        <div class="col-12 col-md-9">
                                                            <input class="form-control"
                                                                value="{{optional($project->mandeperson)->name}}" readonly
                                                                type="text" />
                                                        </div>
                                                    </div>
                                                    <div class="row form-group">
                                                        <table id="alluserstonotifytable"
                                                            class="table table-responsive table-bordered table-striped table-hover"
                                                            style="margin:4px">
                                                            <thead class="bg-secondary text-white">
                                                                <tr>
                                                                    <th scope="col">Select</th>
                                                                    <th scope="col">Name</th>
                                                                    <th scope="col">PFNO</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                @if (isset($allusers))
                                                                    @foreach ($allusers as $nuser)
                                                                            <tr>
                                                                            <td>
                                                                                <input name="supervisorfk" id="{{ $nuser->userid }}"                                                                                    class="form-check-input"
                                                                                    value="{{ $nuser->userid }}" type="radio" 
                                                                                    {{ $project->supervisorfk == $nuser->userid ?? 'checked'  }}
                                                                                    >
                                                                            </td>
                                                                            <td>
                                                                                <label for="{{$nuser->userid}}"
                                                                                    class="form-check-label">{{$nuser->name }}</label>
                                                                            </td>
                                                                            <td>
                                                                                <label for="{{$nuser->userid}}"
                                                                                    class="form-check-label">{{$nuser->pfno}}</label>
                                                                            </td>
                                                                        </tr>
                                                                    @endforeach
                                                                   @endif

                                                            </tbody>
                                                        </table>
                                                    </div>

                                                </form>

                                            </div>
                                            <div class="modal-footer">
                                                <button id="btn_closemandemodal" type="button" class="btn btn-secondary"
                                                    data-bs-dismiss="modal">Close</button>
                                                <button id="btn_savemande" type="submit" form="form_assignmande"
                                                    class="btn btn-primary">Save and
                                                    Sign</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!--cancel project Modal -->
                                <div class="modal fade" id="cancelprojectmodal" data-bs-backdrop="static"
                                    data-bs-keyboard="false" tabindex="-1" aria-labelledby="cancelprojectmodalLabel"
                                    aria-hidden="true">
                                    <div class="modal-dialog">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title" id="cancelprojectmodalLabel">Cancel Project</h5>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                                    aria-label="Close"></button>
                                            </div>
                                            <div class="modal-body">
                                                Are you sure you want to Cancel the Project?
                                            </div>
                                            <div class="modal-footer">
                                                <button id="btn_closecancelprojectmodal" type="button" class="btn btn-secondary"
                                                    data-bs-dismiss="modal">Close</button>
                                                <form id="form_cancelproject" method="POST"
                                                    action="{{ route('api.projects.cancelproject', ['id' => $project->researchid]) }}">
                                                    @csrf
                                                    <button id="btn_savecancelproject" type="submit"
                                                        class="btn btn-danger">Cancel Project</button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!--complete project Modal -->
                                <div class="modal fade" id="completeprojectmodal" data-bs-backdrop="static"
                                    data-bs-keyboard="false" tabindex="-1" aria-labelledby="cancelprojectmodalLabel"
                                    aria-hidden="true">
                                    <div class="modal-dialog">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title" id="completeprojectmodalLabel">Complete Project</h5>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                                    aria-label="Close"></button>
                                            </div>
                                            <div class="modal-body">
                                                Are you sure you want to Mark the Project as COMPLETE and close?
                                            </div>
                                            <div class="modal-footer">
                                                <button id="btn_closecompleteprojectmodal" type="button"
                                                    class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                <form id="form_completeproject" method="POST"
                                                    action="{{ route('api.projects.completeproject', ['id' => $project->researchid]) }}">
                                                    @csrf
                                                    <button id="btn_savecompleteproject" type="submit"
                                                        class="btn btn-success">Complete Project</button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h5 class="text-center">Research Progress</h5>
                                <table id="researchprogresstable"
                                    class="table table-responsive table-bordered table-striped table-hover" style="margin:4px">
                                    <thead class="bg-secondary text-white">
                                        <tr>
                                            <th scope="col" style="width:30%;">Date</th>
                                            <th scope="col" style="width:70%;">Report</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <script>

                            $(document).ready(function () {
                                let projectid = "{{ isset($project) ? $project->researchid : '' }}"; // Check if depid is set
                                let userid = "{{auth()->user()->userid}}"
                                let payload = $('#csrf_form')?.serialize();
                                document.getElementById('btn_saveprogress')?.addEventListener('click', function () {
                                    submitreporturl = `{{ route('api.projects.submitmyprogress', ['id' => ':id']) }}`.replace(':id', projectid);
                                    var formData = $('#form_researchprogress').serialize();
                                    formData += '&researchidfk=' + projectid;
                                    formData += '&reportedbyfk=' + userid;

                                    // Function to fetch data using AJAX
                                    $.ajax({
                                        url: submitreporturl,
                                        type: 'POST',
                                        data: formData,
                                        dataType: 'json',
                                        success: function (response) {
                                            var closebtn = document.getElementById('btn_closeprogressmodal');
                                            if (closebtn) { closebtn.click(); }
                                            showtoastmessage(response);
                                            fetchresearchprogress();
                                        },
                                        error: function (xhr, status, error) {
                                            var mess = JSON.stringify(xhr.responseJSON.message);
                                            var type = JSON.stringify(xhr.responseJSON.type);
                                            var result = {
                                                message: mess,
                                                type: type
                                            };
                                            showtoastmessage(result);

                                            console.error('Error fetching data:', error);
                                        }
                                    });
                                });

                                // Function to fetch data using AJAX
                                function fetchresearchprogress() {
                                    let progressurl = `{{ route('api.projects.fetchprojectprogress', ['id' => ':id']) }}`.replace(':id', projectid);
                                    $.ajax({
                                        url: progressurl,
                                        type: 'GET',
                                        dataType: 'json',
                                        success: function (response) {
                                            populateReseaechProgressTable(response);
                                        },
                                        error: function (xhr, status, error) {
                                            console.error('Error fetching data:', error);
                                        }
                                    });
                                }

                                // Function to populate table with data
                                function populateReseaechProgressTable(data) {
                                    var tbody = $('#researchprogresstable tbody');
                                    tbody.empty(); // Clear existing table rows
                                    if (data.length > 0) {
                                        $.each(data, function (index, data) {
                                            var row = '<tr>' +
                                                '<td>' + new Date(data.created_at).toDateString("en-US") + '</td>' +
                                                '<td>' + data.report + '</td>' +
                                                '</tr>';
                                            tbody.append(row);
                                        });
                                    }
                                    else {
                                        var row = '<tr><td colspan="3">No Reports found</td></tr>';
                                        tbody.append(row);
                                    }
                                }  // Initial fetch when the page loads
                                fetchresearchprogress();


                            });
                        </script>


                    </div>

                    <!-- funding tab -->
                    <div role="tabpanel" class="tab-pane" id="panel-funding">
                        <div>
                            <div class="row form-group">
                                <div class="col-8">
                                    <form>
                                        <div class="row form-group">
                                            <div class="col col-md-4">
                                                <label class="form-control-label">Total Amount Released</label>
                                            </div>
                                            <div class="col-12 col-md-8">
                                                <input id="input_totalfunds" type="number" placeholder="0.00"
                                                    class="form-control" readonly />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div class="col-4">
                                    @if (auth()->user()->haspermission('canaddprojectfunding'))
                                        <button id="btn_openfundingmodule" type="button" class="btn btn-info text-white"
                                            data-bs-toggle="modal" data-bs-target="#addfundingmodal">
                                            Add Funding
                                        </button>
                                    @endif


                                </div>
                            </div>
                            <!-- modals div -->
                            <div>
                                <!--add funding Modal -->
                                <div class="modal fade" id="addfundingmodal" data-bs-backdrop="static" data-bs-keyboard="false"
                                    tabindex="-1" aria-labelledby="addfundingmodalLabel" aria-hidden="true">
                                    <div class="modal-dialog">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title" id="addfundingmodalLabel">Add Project Funding</h5>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                                    aria-label="Close"></button>
                                            </div>
                                            <div class="modal-body">
                                                <form id="form_addfunding" method="POST">
                                                    @csrf
                                                    <div class="row form-group">
                                                        <div class="col col-md-3">
                                                            <label class="form-control-label">Amount</label>
                                                        </div>
                                                        <div class="col-12 col-md-9">
                                                            <input name="amount" type="number" placeholder="0.00"
                                                                class="form-control" />
                                                        </div>
                                                    </div>

                                                </form>
                                            </div>
                                            <div class="modal-footer">
                                                <button id="btn_closefundingmodal" type="button" class="btn btn-secondary"
                                                    data-bs-dismiss="modal">Close</button>
                                                <button id="btn_savefunding" type="button" class="btn btn-primary">Save
                                                    Funding</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <table id="fundingtable" class="table table-responsive table-bordered table-striped table-hover"
                                style="margin:4px">
                                <thead class="bg-secondary text-white">
                                    <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">User</th>
                                        <th scope="col">Amount</th>
                                        <th scope="col">Date</th>
                                    </tr>
                                </thead>
                                <tbody>

                                </tbody>
                            </table>
                        </div>
                        <script>

                            $(document).ready(function () {
                                var userid = "{{ Auth::user()->userid }}";
                                let projectid = "{{ isset($project) ? $project->researchid : '' }}"; // Check if depid is set
                                addfundingurl = `{{ route('api.projects.addfunding', ['id' => ':id']) }}`.replace(':id', projectid);
                                fetchfundingurl = `{{ route('api.projects.fetchprojectfunding', ['id' => ':id']) }}`.replace(':id', projectid);
                                document.getElementById('btn_savefunding')?.addEventListener('click', function () {

                                    var formData = $('#form_addfunding').serialize();

                                    // Function to fetch data using AJAX
                                    $.ajax({
                                        url: addfundingurl,
                                        type: 'POST',
                                        data: formData,
                                        dataType: 'json',
                                        success: function (response) {
                                            var closebtn = document.getElementById('btn_closefundingmodal');
                                            if (closebtn) { closebtn.click(); }
                                            showtoastmessage(response);
                                            fetchfundingData();
                                        },
                                        error: function (xhr, status, error) {
                                            var mess = JSON.stringify(xhr.responseJSON.message);
                                            var type = JSON.stringify(xhr.responseJSON.type);
                                            var result = {
                                                message: mess,
                                                type: type
                                            };
                                            showtoastmessage(result);

                                            console.error('Error fetching data:', error);
                                        }
                                    });
                                });


                                // Function to fetch data using AJAX
                                function fetchfundingData() {
                                    $.ajax({
                                        url: fetchfundingurl,
                                        type: 'GET',
                                        dataType: 'json',
                                        success: function (response) {
                                            populatefundingTable(response);
                                        },
                                        error: function (xhr, status, error) {
                                            console.error('Error fetching data:', error);
                                        }
                                    });
                                }

                                // Function to populate table with data
                                function populatefundingTable(data) {
                                    if (parseInt(data?.fundingrows) >= 3) {
                                        document.getElementById('btn_openfundingmodule')?.setAttribute('hidden', true);
                                        document.getElementById('btn_savefunding')?.setAttribute('hidden', true);
                                    }
                                    document.getElementById('input_totalfunds').value = parseInt(data?.total);
                                    var tbody = $('#fundingtable tbody');
                                    tbody.empty(); // Clear existing table rows
                                    if (data?.fundingrecords?.length > 0) {
                                        $.each(data?.fundingrecords, function (index, data) {
                                            var row = '<tr>' +
                                                '<td>' + data.id + '</td>' +
                                                '<td>' + data.applicant?.name + '</td>' +
                                                '<td>' + data.amount + '</td>' +
                                                '<td>' + new Date(data.created_at).toDateString("en-US") + '</td>' +
                                                '</tr>';
                                            tbody.append(row);
                                        });
                                    }
                                    else {
                                        var row = '<tr><td colspan="4">No Fundings History found</td></tr>';
                                        tbody.append(row);
                                    }
                                }
                                fetchfundingData();

                            });
                        </script>


                    </div>

                </div>
            </div>
        </div>
    @endif


@endauth
@endsection