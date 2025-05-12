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

            <div class="prop-tabcontainer">
                <!-- Nav tabs -->
                <nav>
                    <div class="nav nav-tabs" id="nav-tab" role="tablist">
                        <button class="nav-link active" id="nav-researchinfo-tab" data-bs-toggle="tab"
                            data-bs-target="#panel-researchinfo" type="button" role="tab" aria-controls="panel-researchinfo"
                            aria-selected="true">Research Info</button>
                        <button class="nav-link" id="nav-researchprogress-tab" data-bs-toggle="tab"
                            data-bs-target="#panel-researchprogress" type="button" role="tab"
                            aria-controls="panel-researchprogress" aria-selected="false">Monitoring</button>
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
                                var canviewuser = false;
                                @if(Auth::user()->haspermission('canedituserprofile'))
                                    canviewuser = true;
                                @endif

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

                    <!-- monitoring tab -->
                    <div role="tabpanel" class="tab-pane" id="panel-researchprogress">
                        <div>
                           @if (isset($project) && $project->projectstatus=="Active")
                           <div class="row form-group">
                                <div class="col text-center">
                                    <button id="btn_addreport" type="button" class="btn btn-success " data-bs-toggle="modal"
                                    data-bs-target="#addresearchprogressmodal">Add Report</button>
                                </div>
                            </div>
                           @endif
                            <!-- modals div -->
                            <div>
                                <!--add progress Modal -->
                                <div class="modal fade" id="addresearchprogressmodal" data-bs-backdrop="static"
                                    data-bs-keyboard="false" tabindex="-1" aria-labelledby="researchprogressmodalLabel"
                                    aria-hidden="true">
                                    <div class="modal-dialog">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title" id="researchprogressmodalLabel">Monitoring Report</h5>
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
                                                    <div class="row form-group">
                                                        <div class="col col-md-3">
                                                            <label class="form-control-label">Remark</label>
                                                        </div>
                                                        <div class="col-12 col-md-9">
                                                            <input name="remark" placeholder="Report Remark"
                                                                class="form-control" type="text"/>
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
                            </div>
                            <div>
                                <h5 class="text-center">Monitoring & Evaluation Progress Reports</h5>
                                <table id="researchprogresstable"
                                    class="table table-responsive table-bordered table-striped table-hover" style="margin:4px">
                                    <thead class="bg-secondary text-white">
                                        <tr>
                                            <th scope="col" style="width:20%;">Date</th>
                                            <th scope="col" style="width:60%;">Report</th>
                                            <th scope="col" style="width:20%;">Remark</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <script>

                            $(document).ready(function () {
                                var userid = "{{ Auth::user()->userid }}";
                                let projectid = "{{ isset($project) ? $project->researchid : '' }}"; // Check if depid is set
                                submitreporturl = `{{ route('api.supervision.monitoring.addreport', ['id' => ':id']) }}`.replace(':id', projectid);
                                progressurl = `{{ route('api.supervision.monitoring.fetchmonitoringreport', ['id' => ':id']) }}`.replace(':id', projectid);
                                document.getElementById('btn_saveprogress')?.addEventListener('click', function () {

                                    var formData = $('#form_researchprogress').serialize();

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
                                                '<td>' + data.remark + '</td>' +
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

                </div>
            </div>
        </div>
    @endif
@endauth
@endsection