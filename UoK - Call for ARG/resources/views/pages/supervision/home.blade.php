@extends('layouts.master')

@section('content')
@auth
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
                    <button class="nav-link active" id="nav-activeprojects-tab" data-bs-toggle="tab"
                        data-bs-target="#panel-activeprojects" type="button" role="tab" aria-controls="panel-activeprojects"
                        aria-selected="true">Active</button>
                    <button class="nav-link" id="nav-allprojects-tab" data-bs-toggle="tab"
                        data-bs-target="#panel-allprojects" type="button" role="tab" aria-controls="panel-allprojects"
                        aria-selected="false">All Projects</button>
                </div>
            </nav>

            <!-- Tab panes -->
            <div class="tab-content prop-tabpanel">

                <!-- activeprojects Details -->
                <div role="tabpanel" class="tab-pane active" id="panel-activeprojects">
                    <div>
                        <table id="activeprojectstable"
                            class="table table-responsive table-bordered table-striped table-hover" style="margin:4px">
                            <thead class="bg-secondary text-white">
                                <tr>
                                    <th scope="col">#ID</th>
                                    <th scope="col">Researcher</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Is Paused?</th>
                                    <th scope="col">Start Date</th>
                                    <th scope="col">End Date</th>
                                </tr>
                            </thead>
                            <tbody>

                            </tbody>
                        </table>
                    </div>
                    <script>

                        $(document).ready(function () {


                            // Function to fetch data using AJAX
                            function fetchactiveprojects() {
                                $.ajax({
                                    url: "{{ route('api.projects.fetchallactiveprojects') }}",
                                    type: 'GET',
                                    dataType: 'json',
                                    success: function (response) {
                                        populateActiveProjects(response);
                                    },
                                    error: function (xhr, status, error) {
                                        console.error('Error fetching data:', error);
                                    }
                                });
                            }

                            var routeUrlTemplate = "{{ route('pages.supervision.monitoring.monitoringpage', ['id' => '__ID__']) }}";

                            // Function to populate table with data
                            function populateActiveProjects(data) {
                                var canviewuser = false;
                                var tbody = $('#activeprojectstable tbody');
                                tbody.empty(); // Clear existing table rows
                                if (data.length > 0 && tbody) {
                                    $.each(data, function (index, data) {
                                        var projecturl = routeUrlTemplate.replace('__ID__', data.researchid);
                                        var row = '<tr>' +
                                            '<td><a class="nav-link pt-0 pb-0" href="' + projecturl + '">' + data.researchnumber + '</a></td>' +
                                            '<td>' + data.applicant?.name + '</td>' +
                                            '<td>' + data.projectstatus + '</td>' +
                                            '<td>' + Boolean(data.ispaused) + '</td>' +
                                            '<td>' + new Date(data.proposal?.commencingdate).toDateString("en-US") + '</td>' +
                                            '<td>' + new Date(data.proposal?.terminationdate).toDateString("en-US") + '</td>' +
                                            '</tr>';
                                        tbody.append(row);
                                    });
                                }
                                else {
                                    var row = '<tr><td colspan="5">No Active Projects found</td></tr>';
                                    tbody.append(row);
                                }
                            }
                            // Initial fetch when the page loads
                            fetchactiveprojects();
                        });
                    </script>
                </div>


                <!-- allprojects tab -->
                <div role="tabpanel" class="tab-pane" id="panel-allprojects">
                    <div>
                        <form class="form-horizontal">
                            <div class="row form-group">
                                <div class="col-12">

                                    <input type="text" id="searchInput" class="form-control text-center"
                                        style="::placeholder { color: red; }"
                                        placeholder="Search by Researcher Name or Status">
                                </div>
                            </div>
                        </form>
                        <table id="allprojectstable" class="table table-responsive table-bordered table-striped table-hover"
                            style="margin:4px">
                            <thead class="bg-secondary text-white">
                                <tr>
                                    <th scope="col">#ID</th>
                                    <th scope="col">Researcher</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Is Paused?</th>
                                    <th scope="col">Start Date</th>
                                    <th scope="col">End Date</th>
                                </tr>
                            </thead>
                            <tbody>

                            </tbody>
                        </table>
                    </div>
                    <script>

                        $(document).ready(function () {
                            var canviewuser = false;
                            @if(Auth::user()->haspermission('canedituserprofile'))
                                canviewuser = true;
                            @endif

                            // Function to fetch data using AJAX
                            function fetchallprojects() {
                                $.ajax({
                                    url: "{{ route('api.projects.fetchallprojects') }}",
                                    type: 'GET',
                                    dataType: 'json',
                                    success: function (response) {
                                        populateallProjects(response);
                                    },
                                    error: function (xhr, status, error) {
                                        console.error('Error fetching data:', error);
                                    }
                                });
                            }

                            // Function to search data using AJAX
                            function searchallprojects(searchTerm) {
                                $.ajax({
                                    url: "{{ route('api.projects.fetchsearchallprojects') }}",
                                    type: 'GET',
                                    dataType: 'json',
                                    data: {
                                        search: searchTerm
                                    },
                                    success: function (response) {
                                        populateallProjects(response);
                                    },
                                    error: function (xhr, status, error) {
                                        console.error('Error searching data:', error);
                                    }
                                });
                            }
                            var routeUrlTemplate = "{{ route('pages.supervision.monitoring.monitoringpage', ['id' => '__ID__']) }}";

                            // Function to populate table with data
                            function populateallProjects(data) {
                                var canviewuser = false;
                                var tbody = $('#allprojectstable tbody');
                                tbody.empty(); // Clear existing table rows
                                if (data.length > 0 && tbody) {
                                    $.each(data, function (index, data) {
                                        var projecturl = routeUrlTemplate.replace('__ID__', data.researchid);
                                        var row = '<tr>' +
                                            '<td><a class="nav-link pt-0 pb-0" href="' + projecturl + '">' + data.researchnumber + '</a></td>' +
                                            '<td>' + data.applicant?.name + '</td>' +
                                            '<td>' + data.projectstatus + '</td>' +
                                            '<td>' + Boolean(data.ispaused) + '</td>' +
                                            '<td>' + new Date(data.proposal?.commencingdate).toDateString("en-US") + '</td>' +
                                            '<td>' + new Date(data.proposal?.terminationdate).toDateString("en-US") + '</td>' +
                                            '</tr>';
                                        tbody.append(row);
                                    });
                                }
                                else {
                                    var row = '<tr><td colspan="5">No Active Projects found</td></tr>';
                                    tbody.append(row);
                                }
                            }

                            // Search input keyup event
                            $('#searchInput').on('keyup', function () {
                                var searchTerm = $(this).val().toLowerCase();
                                if (searchTerm.length >= 3) { // Optional: adjust the minimum search term length
                                    searchallprojects(searchTerm);
                                } else if (searchTerm.length === 0) {
                                    fetchallprojects(); // Fetch all data when search input is empty
                                }
                            });

                            // Initial fetch when the page loads
                            fetchallprojects();
                        });
                    </script>


                </div>

            </div>
        </div>


    </div>
@endauth
@endsection