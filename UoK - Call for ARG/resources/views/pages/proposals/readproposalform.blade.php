@extends('layouts.master')

@section('content')
     @if (isset($prop))
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
                        <button class="nav-link active" id="nav-personal-tab" data-bs-toggle="tab"
                            data-bs-target="#panel-basicdetails" type="button" role="tab" aria-controls="panel-basicdetails"
                            aria-selected="true">Basic Details</button>
                        <button class="nav-link" id="nav-research-tab" data-bs-toggle="tab" data-bs-target="#panel-research"
                            type="button" role="tab" aria-controls="panel-profile" aria-selected="false">Research</button>
                        <button class="nav-link" id="nav-collaboration-tab" data-bs-toggle="tab"
                            data-bs-target="#panel-collaboration" type="button" role="tab" aria-controls="panel-collaboration"
                            aria-selected="false">C & P Lists</button>
                        <button class="nav-link" id="nav-finance-tab" data-bs-toggle="tab" data-bs-target="#panel-finance"
                            type="button" role="tab" aria-controls="panel-finance" aria-selected="false">Finance</button>
                        <button class="nav-link" id="nav-researchdesign-tab" data-bs-toggle="tab"
                            data-bs-target="#panel-researchdesign" type="button" role="tab" aria-controls="panel-researchdesign"
                            aria-selected="false">Research Design</button>
                        <button class="nav-link" id="nav-workplan-tab" data-bs-toggle="tab" data-bs-target="#panel-workplan"
                            type="button" role="tab" aria-controls="panel-workplan" aria-selected="false">Workplan</button>

                        @if (Auth::user()->haspermission('canviewofficeuse') && $prop->submittedstatus)
                            <button class="nav-link" id="nav-officeuse-tab" data-bs-toggle="tab" data-bs-target="#panel-officeuse"
                                type="button" role="tab" aria-controls="panel-officeuse" aria-selected="false">Office Use</button>


                        @endif











                    </div>
                </nav>

                <!-- Tab panes -->
                <div class="tab-content prop-tabpanel">
                    <!-- Basic Details -->
                    <div role="tabpanel" class="tab-pane active" id="panel-basicdetails">
                        <!-- Personal Details Form -->
                        <form method="POST" id="basicdetails" enctype="multipart/form-data" class="form-horizontal">
                            @csrf
                            <div class="row form-group">
                                <div class="col col-md-3">
                                    <label class="form-control-label">Full Name</label>
                                </div>
                                <div class="col-12 col-md-9">
                                    <input type="text" id="fullname" name="fullname" placeholder="Your Full Name"
                                        value="{{$prop->applicant->name}}" class="form-control" readonly>
                                </div>
                            </div>

                            <div class="row form-group">
                                <div class="col col-md-3">
                                    <label class="form-control-label">Email</label>
                                </div>
                                <div class="col-12 col-md-9">
                                    <input type="text" id="email" name="email" placeholder="Your Email"
                                        value="{{ $prop->applicant->email}}" class="form-control" readonly>
                                </div>
                            </div>

                            <div class="row form-group">
                                <div class="col col-md-3">
                                    <label class="form-control-label">PF Number</label>
                                </div>
                                <div class="col-12 col-md-9">
                                    <input type="text" id="pfnofk" name="pfnofk" placeholder="Your PF Number"
                                        value="{{$prop->applicant->pfno }}" class="form-control" readonly>
                                </div>
                            </div>

                            <div class="row form-group">
                                <div class="col col-md-3">
                                    <label class="form-control-label">Grant Number</label>
                                </div>
                                <div class="col-12 col-md-9">
                                    <input type="text" id="grantnofk" name="grantnofk" placeholder="Grant"
                                        value="{{$prop->grantitem->title }}" class="form-control" readonly>
                                </div>
                            </div>
                            <div class="row form-group">
                                <div class="col col-md-3">
                                    <label class="form-control-label">Research Theme</label>
                                </div>
                                <div class="col-12 col-md-9">
                                    <input type="text" id="themefk" name="themefk" placeholder="Theme"
                                        value="{{$prop->themeitem->themename }}" class="form-control" readonly>
                                </div>
                            </div>
                            <div class="row form-group">
                                <div class="col col-md-3">
                                    <label class="form-control-label">Department Name</label>
                                </div>
                                <div class="col-12 col-md-9">
                                    <input type="text" id="departmentidfk" name="departmentidfk" placeholder="Department"
                                        value="{{$prop->department->shortname }}" class="form-control" readonly>
                                </div>
                            </div>

                            <div class="row form-group">
                                <div class="col col-md-3">
                                    <label class="form-control-label">Highest Qualification</label>
                                </div>
                                <div class="col-12 col-md-9">
                                    <input type="text" id="highestqualification" name="highestqualification"
                                        placeholder="Highest Qualification" class="form-control"
                                        value="{{ $prop->highqualification  }}" readonly>
                                </div>
                            </div>

                            <div class="row form-group">
                                <div class="col col-md-3">
                                    <label class="form-control-label">Office Telephone</label>
                                </div>
                                <div class="col-12 col-md-9">
                                    <input type="text" id="officephone" name="officephone" placeholder="Office Telephone"
                                        class="form-control" value="{{ $prop->officephone }}" readonly>
                                </div>
                            </div>

                            <div class="row form-group">
                                <div class="col col-md-3">
                                    <label class="form-control-label">Cellphone</label>
                                </div>
                                <div class="col-12 col-md-9">
                                    <input type="text" id="cellphone" name="cellphone" placeholder="Cellphone"
                                        class="form-control" value="{{$prop->cellphone }}" readonly>
                                </div>
                            </div>

                            <div class="row form-group">
                                <div class="col col-md-3">
                                    <label class="form-control-label">Fax Number</label>
                                </div>
                                <div class="col-12 col-md-9">
                                    <input type="text" id="faxnumber" name="faxnumber" placeholder="Fax Number"
                                        class="form-control" value="{{ $prop->faxnumber  }}" readonly>
                                </div>
                            </div>


                        </form>
                    </div>


                    <!-- Research tab -->
                    <div role="tabpanel" class="tab-pane" id="panel-research">
                        <form id="form_researchinfo" method="POST"
                            action="{{ isset($prop) ? route('route.proposals.updateresearchdetails', ['id' => $prop->proposalid]) : route('route.proposals.post') }}"
                            enctype="multipart/form-data" class="form-horizontal">
                            @csrf
                            <div class="row form-group">
                                <div class="col col-md-3">
                                    <label class="form-control-label">Research Title</label>
                                </div>
                                <div class="col-12 col-md-9">
                                    <input type="text" id="researchtitle" name="researchtitle" placeholder="Research Title"
                                        class="form-control" value="{{ isset($prop) ? $prop->researchtitle : '' }}" readonly>
                                </div>
                            </div>
                            <div class="row form-group">
                                <div class="col col-md-3"><label class=" form-control-label">
                                        Commencing Date</label>
                                </div>
                                <div class="col-12 col-md-9">
                                    <input type="date" id="commencingdate" name="commencingdate" placeholder="DD/MM/YYYY"
                                        class="form-control" value="{{ $prop->commencingdate }}" readonly>
                                </div>
                            </div>
                            <div class="row form-group">
                                <div class="col col-md-3"><label class=" form-control-label">
                                        Termination Date</label>
                                </div>
                                <div class="col-12 col-md-9">
                                    <input type="date" id="terminationdate" name="terminationdate" placeholder="DD/MM/YYYY"
                                        class="form-control" value="{{ $prop->terminationdate}}" readonly>
                                </div>
                            </div>
                            <script>
                                $(document).ready(function () {
                                    // Get today's date in YYYY-MM-DD format
                                    const today = new Date().toISOString().split('T')[0];

                                    // Set the min attribute of the date input to today's date
                                    document.getElementById('commencingdate').setAttribute('min', today);
                                    document.getElementById('terminationdate').setAttribute('min', today);
                                });
                            </script>

                            <div class="row form-group">
                                <div class="col col-md-3">
                                    <label class="form-control-label">Objectives</label>
                                </div>
                                <div class="col-12 col-md-9">
                                    <textarea name="objectives" placeholder="Objectives" class="form-control"
                                        readonly>{{ isset($prop) ? $prop->objectives : '' }}</textarea>
                                </div>
                            </div>
                            <div class="row form-group">
                                <div class="col col-md-3">
                                    <label class="form-control-label">Question/Hypothesis</label>
                                </div>
                                <div class="col-12 col-md-9">
                                    <textarea name="hypothesis" placeholder="Question or Hypothesis" class="form-control"
                                        disabled readonly>{{ isset($prop) ? $prop->hypothesis : '' }}</textarea>
                                </div>
                            </div>
                            <div class="row form-group">
                                <div class="col col-md-3">
                                    <label class="form-control-label">Significance</label>
                                </div>
                                <div class="col-12 col-md-9">
                                    <textarea name="significance" placeholder="Significance or Justification"
                                        class="form-control" readonly>{{ isset($prop) ? $prop->significance : '' }}</textarea>
                                </div>
                            </div>
                            <div class="row form-group">
                                <div class="col col-md-3">
                                    <label class="form-control-label">Ethical Considerations</label>
                                </div>
                                <div class="col-12 col-md-9">
                                    <textarea name="ethicals" placeholder="Ethical Considerations" class="form-control"
                                        readonly>{{ isset($prop) ? $prop->ethicals : '' }}</textarea>
                                </div>
                            </div>
                            <div class="row form-group">
                                <div class="col col-md-3">
                                    <label class="form-control-label">Expected Outputs</label>
                                </div>
                                <div class="col-12 col-md-9">
                                    <textarea name="outputs" placeholder="Expected Outputs" class="form-control"
                                        readonly>{{ isset($prop) ? $prop->expoutput : '' }}</textarea>
                                </div>
                            </div>
                            <div class="row form-group">
                                <div class="col col-md-3">
                                    <label class="form-control-label">Socio-Economic Impact</label>
                                </div>
                                <div class="col-12 col-md-9">
                                    <textarea name="economicimpact" placeholder="Socio-Economic Impact" class="form-control"
                                        readonly>{{ isset($prop) ? $prop->socio_impact : '' }}</textarea>
                                </div>
                            </div>
                            <div class="row form-group">
                                <div class="col col-md-3">
                                    <label class="form-control-label">Research Findings</label>
                                </div>
                                <div class="col-12 col-md-9">
                                    <textarea name="res_findings" placeholder="Dissemination of Research Findings"
                                        class="form-control" readonly>{{ isset($prop) ? $prop->res_findings : '' }}</textarea>
                                </div>
                            </div>
                        </form>
                        @if (!isset($prop))
                            <div class="row form-group">
                                <div class="col-lg-6 col-md-6 col-sm-12 offset-lg-4 offset-md-4">
                                    <button id="saveresearchinfobutton" form="form_researchinfo" type="submit"
                                        class="btn btn-primary" style="width:200px; margin-top:8px;">
                                        Save Research Details
                                    </button>
                                </div>
                            </div>
                        @endif










                    </div>


                    <!-- Collaborators tab -->
                    <div role="tabpanel" class="tab-pane" id="panel-collaboration">
                        <style>
                            .nav-tabs .nav-link {
                                flex: 1;
                                /* Ensure each nav-link takes up an equal portion of the nav-tabs */
                                text-align: center;
                                /* Center the text within each nav-link */
                            }
                        </style>



                        <!-- Collaborators details table -->
                        <div class="row form-group">
                            <div>collaborators</div>
                            <div style="max-height: 300px; overflow-y: auto;">
                                <table id="collaboratorstable"
                                    class="table table-responsive table-bordered table-striped table-hover" style="margin:4px">
                                    <thead class="bg-light text-dark">
                                        <tr>
                                            <th scope="col">Name</th>
                                            <th scope="col">Position</th>
                                            <th scope="col">Institution</th>
                                            <th scope="col">Research Area</th>
                                            <th scope="col">Experience</th>
                                            <th scope="col">Date</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                    </tbody>
                                </table>
                            </div>

                        </div>
                        <!-- publications table -->
                        <div class="row form-group">
                            <div>publications</div>
                            <div style="max-height: 300px; overflow-y: auto;">

                                <table id="publicationstable"
                                    class="table table-responsive table-bordered table-striped table-hover" style="margin:4px">
                                    <thead class="bg-light text-dark">
                                        <tr>
                                            <th scope="col">Authors (s)</th>
                                            <th scope="col">Year</th>
                                            <th scope="col">Title</th>
                                            <th scope="col">Research Area</th>
                                            <th scope="col">Experience</th>
                                            <th scope="col">Publisher</th>
                                            <th scope="col">Volume</th>
                                            <th scope="col">Pages</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                    </tbody>
                                </table>
                            </div>
                        </div>




                        <script>
                            $(document).ready(function () {

                                let proposalId = "{{ isset($prop) ? $prop->proposalid : '' }}"; // Check if proposalId is set
                                // Assuming prop is passed to the Blade view from the Laravel controller
                                const collaboratorsurl = `{{ route('api.proposals.fetchcollaborators', ['id' => ':id']) }}`.replace(':id', proposalId);
                                const punlicationsurl = `{{ route('api.proposals.fetchpublications', ['id' => ':id']) }}`.replace(':id', proposalId);

                                // Function to fetch collaborators data 
                                function fetchcollaborators() {
                                    $.ajax({
                                        url: collaboratorsurl,
                                        type: 'GET',
                                        dataType: 'json',
                                        success: function (response) {
                                            populatecollaborators(response);
                                        },
                                        error: function (xhr, status, error) {
                                            console.error('Error fetching data:', error);
                                        }
                                    });
                                }

                                // Function to populate collaborators
                                function populatecollaborators(data) {
                                    var tbody = $('#collaboratorstable tbody');
                                    tbody.empty(); // Clear existing table rows
                                    if (data.length > 0) {
                                        $.each(data, function (index, data) {
                                            var row = '<tr>' +
                                                '<td>' + data.collaboratorname + '</td>' +
                                                '<td>' + data.position + '</td>' +
                                                '<td>' + data.institution + '</td>' +
                                                '<td>' + data.researcharea + '</td>' +
                                                '<td>' + data.experience + '</td>' +
                                                '<td>' + new Date(data.created_at).toDateString("en-US") + '</td>' +
                                                '<td>Edit</td>' +
                                                '</tr>';
                                            tbody.append(row);
                                        });
                                    }
                                    else {
                                        var row = '<tr><td colspan="7" class="text-center">No Collaborators found</td></tr>';
                                        tbody.append(row);
                                    }
                                }


                                function fetchpublications() {
                                    $.ajax({
                                        url: punlicationsurl,
                                        type: 'GET',
                                        dataType: 'json',
                                        success: function (response) {
                                            populatepublications(response);
                                        },
                                        error: function (xhr, status, error) {
                                            console.error('Error fetching data:', error);
                                        }
                                    });
                                }
                                // Function to populate collaborators
                                function populatepublications(data) {
                                    var tbody = $('#publicationstable tbody');
                                    tbody.empty(); // Clear existing table rows
                                    if (data.length > 0) {
                                        $.each(data, function (index, data) {
                                            var row = '<tr>' +
                                                '<td>' + data.authors + '</td>' +
                                                '<td>' + data.year + '</td>' +
                                                '<td>' + data.title + '</td>' +
                                                '<td>' + data.researcharea + '</td>' +
                                                '<td>' + data.publisher + '</td>' +
                                                '<td>' + data.volume + '</td>' +
                                                '<td>' + data.pages + '</td>' +
                                                '<td>' + new Date(data.created_at).toDateString("en-US") + '</td>' +
                                                '<td>Edit</td>' +
                                                '</tr>';
                                            tbody.append(row);
                                        });
                                    }
                                    else {
                                        var row = '<tr><td colspan="9" class="text-center">No Publications found</td></tr>';
                                        tbody.append(row);
                                    }
                                }
                                fetchcollaborators();
                                fetchpublications();
                            });
                        </script>


                    </div>


                    <!-- Finance Tab -->
                    <div role="tabpanel" class="tab-pane " id="panel-finance">
                        <form id="form_finance" enctype="multipart/form-data" class="form-horizontal">
                            @csrf
                            <div class="row form-group">

                                <div class="form-group col-lg-3 -col-md-3">
                                    <label class=" form-control-label">Equipments Cost</label>
                                    <input type="number" id="equipmentscost" placeholder="0.00" readonly disabled
                                        class="form-control">
                                </div>
                                <div class="form-group col-lg-3 -col-md-3">
                                    <label class=" form-control-label">Consumables Cost</label>
                                    <input type="number" id="consumablescost" placeholder="0.00" readonly disabled
                                        class="form-control">
                                </div>
                                <div class="form-group col-lg-3 -col-md-3">
                                    <label class=" form-control-label">Travel Cost</label>
                                    <input type="number" id="travelcost" placeholder="0.00" readonly disabled
                                        class="form-control">
                                </div>
                                <div class="form-group col-lg-3 -col-md-3">
                                    <label class=" form-control-label">Other Cost</label>
                                    <input type="number" id="othercost" placeholder="0.00" readonly disabled
                                        class="form-control">
                                </div>
                                <div class="form-group col-lg-3 -col-md-3">
                                    <style>
                                        .bold-input {
                                            font-weight: bold;
                                            /* Additional styles if needed */
                                        }
                                    </style>
                                    <label class=" form-control-label">Total Funds</label>
                                    <input type="text" id="totalfunds" placeholder="0.00" readonly disabled
                                        class="form-control bold-input">
                                </div>
                            </div>

                            <div class="row form-group">

                            </div>

                            <div class="row form-group">
                                <h5>Expenditure Breakdown</h5>
                            </div>
                        </form>
                        <div>

                            <table id="expenditurestable"
                                class="table table-responsive table-bordered table-striped table-hover" style="margin:4px">
                                <thead class="bg-light text-dark">
                                    <tr>
                                        <th scope="col">Item</th>
                                        <th scope="col">Type</th>
                                        <th scope="col">Quantity</th>
                                        <th scope="col">Price</th>
                                        <th scope="col">Total</th>
                                        <th scope="col">Date</th>
                                    </tr>
                                </thead>
                                <tbody>

                                </tbody>
                            </table>
                        </div>
                        <div class="container mt-5">

                            <script>
                                $(document).ready(function () {
                                    // Calculate total when quantity or price changes
                                    document.getElementById('quantity')?.addEventListener('input', calculateTotal);
                                    document.getElementById('unitprice')?.addEventListener('input', calculateTotal);

                                    function calculateTotal() {
                                        const quantity = parseFloat(document.getElementById('quantity').value) || 0;
                                        const price = parseFloat(document.getElementById('unitprice').value) || 0;
                                        const total = quantity * price;
                                        document.getElementById('total').value = total.toFixed(2);
                                    }




                                    let proposalId = "{{ isset($prop) ? $prop->proposalid : '' }}"; // Check if proposalId is set
                                    // Assuming prop is passed to the Blade view from the Laravel controller
                                    const expenditureurl = `{{ route('api.proposals.fetchexpenditures', ['id' => ':id']) }}`.replace(':id', proposalId);




                                    // Function to fetch expenditures data 
                                    function fetchexpenditures() {
                                        $.ajax({
                                            url: expenditureurl,
                                            type: 'GET',
                                            dataType: 'json',
                                            success: function (response) {
                                                populateexpenditures(response);
                                                populatetopfields(response);
                                            },
                                            error: function (xhr, status, error) {
                                                console.error('Error fetching data:', error);
                                            }
                                        });
                                    }

                                    function populatetopfields(data) {
                                        if (data.length > 0) {
                                            let travel = 0;
                                            let consumables = 0;
                                            let facilities = 0;
                                            let others = 0;
                                            let total = 0;
                                            $.each(data, function (index, data) {
                                                total += parseFloat(data.total);
                                                if (data.itemtype == "Facilities") {
                                                    facilities += parseFloat(data.total);
                                                }
                                                else if (data.itemtype == "Consumables") {
                                                    consumables += parseFloat(data.total);
                                                }
                                                else if (data.itemtype == "Travels") {
                                                    travel += parseFloat(data.total);
                                                }
                                                else if (data.itemtype == "Others") {
                                                    others += parseFloat(data.total);
                                                }
                                            });
                                            document.getElementById('totalfunds').value = total;
                                            document.getElementById('travelcost').value = travel;
                                            document.getElementById('equipmentscost').value = facilities;
                                            document.getElementById('othercost').value = others;
                                            document.getElementById('consumablescost').value = consumables;
                                        };
                                    }

                                    // Function to populate collaborators
                                    function populateexpenditures(data) {
                                        var tbody = $('#expenditurestable tbody');
                                        tbody.empty(); // Clear existing table rows
                                        if (data.length > 0) {
                                            $.each(data, function (index, data) {
                                                var row = '<tr>' +
                                                    '<td>' + data.item + '</td>' +
                                                    '<td>' + data.itemtype + '</td>' +
                                                    '<td>' + data.quantity + '</td>' +
                                                    '<td>' + data.unitprice + '</td>' +
                                                    '<td>' + data.total + '</td>' +
                                                    '<td>' + new Date(data.created_at).toDateString("en-US") + '</td>' +
                                                    '<td>Edit</td>' +
                                                    '</tr>';
                                                tbody.append(row);
                                            });
                                        }
                                        else {
                                            var row = '<tr><td colspan="6" class="text-center">No Expenditures found</td></tr>';
                                            tbody.append(row);
                                        }
                                    }

                                    fetchexpenditures();
                                });
                            </script>
                        </div>

                    </div>

                    <!-- Research Design -->
                    <div role="tabpanel" class="tab-pane" id="panel-researchdesign">

                        <div class="row form-group">
                            <h5 class="mt-2">Research Design Items</h5>
                        </div>
                        <div class="row form-group">
                            <table id="reserchdesignitemstable"
                                class="table table-responsive table-bordered table-striped table-hover" style="margin:4px">
                                <thead class="bg-light text-dark">
                                    <tr>
                                        <th scope="col">Summary</th>
                                        <th scope="col">Indicators</th>
                                        <th scope="col">Verification</th>
                                        <th scope="col">Assumptions</th>
                                        <th scope="col">Goal</th>
                                        <th scope="col">Purpose</th>
                                    </tr>
                                </thead>
                                <tbody>

                                </tbody>
                            </table>
                        </div>
                        <script>
                            $(document).ready(function () {


                                let proposalId = "{{ isset($prop) ? $prop->proposalid : '' }}"; // Check if proposalId is set
                                // Assuming prop is passed to the Blade view from the Laravel controller
                                const researchurl = `{{ route('api.proposals.researchdesignitems', ['id' => ':id']) }}`.replace(':id', proposalId);


                                // Function to fetch expenditures data 
                                function fetchresearchdesign() {
                                    $.ajax({
                                        url: researchurl,
                                        type: 'GET',
                                        dataType: 'json',
                                        success: function (response) {
                                            populateresearchdesignitems(response);
                                        },
                                        error: function (xhr, status, error) {
                                            console.error('Error fetching data:', error);
                                        }
                                    });
                                }

                                // Function to populate collaborators
                                function populateresearchdesignitems(data) {
                                    var tbody = $('#reserchdesignitemstable tbody');
                                    tbody.empty(); // Clear existing table rows
                                    if (data.length > 0) {
                                        $.each(data, function (index, data) {
                                            var row = '<tr>' +
                                                '<td>' + data.summary + '</td>' +
                                                '<td>' + data.indicators + '</td>' +
                                                '<td>' + data.verification + '</td>' +
                                                '<td>' + data.assumptions + '</td>' +
                                                '<td>' + data.goal + '</td>' +
                                                '<td>' + data.purpose + '</td>' +
                                                '</tr>';
                                            tbody.append(row);
                                        });
                                    }
                                    else {
                                        var row = '<tr><td colspan="6" class="text-center">No Research Design Items found</td></tr>';
                                        tbody.append(row);
                                    }
                                }

                                fetchresearchdesign();
                            });
                        </script>
                    </div>

                    <!-- Workplan -->
                    <div role="tabpanel" class="tab-pane" id="panel-workplan">

                        <div class="row form-group">
                            <h5 class="mt-1">Workplan Items</h5>
                        </div>
                        <div class="row form-group">
                            <table id="workplaitemstable"
                                class="table table-responsive table-bordered table-striped table-hover" style="margin:4px">
                                <thead class="bg-light text-dark">
                                    <tr>
                                        <th scope="col">Activity</th>
                                        <th scope="col">Time</th>
                                        <th scope="col">Input</th>
                                        <th scope="col">Facilities</th>
                                        <th scope="col">By Whom</th>
                                        <th scope="col">Outcome</th>
                                    </tr>
                                </thead>
                                <tbody>

                                </tbody>
                            </table>
                        </div>
                        <script>
                            $(document).ready(function () {


                                let proposalId = "{{ isset($prop) ? $prop->proposalid : '' }}"; // Check if proposalId is set
                                // Assuming prop is passed to the Blade view from the Laravel controller
                                const workplanurl = `{{ route('api.proposals.fetchworkplanitems', ['id' => ':id']) }}`.replace(':id', proposalId);


                                // Function to fetch expenditures data 
                                function fetchworkplanitems() {
                                    $.ajax({
                                        url: workplanurl,
                                        type: 'GET',
                                        dataType: 'json',
                                        success: function (response) {
                                            populateworkplanitems(response);
                                        },
                                        error: function (xhr, status, error) {
                                            console.error('Error fetching data:', error);
                                        }
                                    });
                                }

                                // Function to populate collaborators
                                function populateworkplanitems(data) {
                                    var tbody = $('#workplaitemstable tbody');
                                    tbody.empty(); // Clear existing table rows
                                    if (data.length > 0) {
                                        $.each(data, function (index, data) {
                                            var row = '<tr>' +
                                                '<td>' + data.activity + '</td>' +
                                                '<td>' + data.time + '</td>' +
                                                '<td>' + data.input + '</td>' +
                                                '<td>' + data.facilities + '</td>' +
                                                '<td>' + data.bywhom + '</td>' +
                                                '<td>' + data.outcome + '</td>' +
                                                '</tr>';
                                            tbody.append(row);
                                        });
                                    }
                                    else {
                                        var row = '<tr><td colspan="6" class="text-center">No WorkPlan Items found</td></tr>';
                                        tbody.append(row);
                                    }
                                }

                                fetchworkplanitems();
                            });
                        </script>
                    </div>


                    <!-- Office Use -->
                    <div role="tabpanel" class="tab-pane" id="panel-officeuse">
                        <div class="row form-group">
                            @if(Auth::user()->canreceiveproposal($prop->proposalid))
                                <div class="col text-center">
                                    <button id="btn_receiveproposal" type="button" class="btn btn-info ">Receive
                                        Proposal</button>
                                </div>
                            @endif










                            @if(Auth::user()->canenableediting($prop->proposalid))
                                <div class="col text-center">
                                    <button id="btn_enableproposalediting" type="button" class="btn btn-info ">Enable
                                        Editing</button>
                                </div>
                            @endif










                            @if(Auth::user()->candisableediting($prop->proposalid))
                                <div class="col text-center">
                                    <button id="btn_disableproposalediting" type="button" class="btn btn-info ">Disable
                                        Editing</button>
                                </div>
                            @endif










                            @if(Auth::user()->canproposechanges($prop->proposalid))
                                <div class="col text-center">
                                    <button id="btn_open_proposalchangeform" type="button" class="btn btn-info "
                                        data-bs-toggle="modal" data-bs-target="#proposalchangeModal">Propose Changes</button>
                                </div>
                            @endif










                            @if(Auth::user()->canrejectproposal($prop->proposalid))
                                <div class="col text-center">
                                    <button id="btn_openreject_proposalmodal" type="button" class="btn btn-danger "
                                        data-bs-toggle="modal" data-bs-target="#approveproposalModal" data-action="reject">Reject
                                        Application</button>
                                </div>
                            @endif










                            @if(Auth::user()->canapproveproposal($prop->proposalid))
                                <div class="col text-center">
                                    <button id="btn_openapprove_proposalmodal" type="button" class="btn btn-success "
                                        data-bs-toggle="modal" data-bs-target="#approveproposalModal"
                                        data-action="approve">Approve</button>
                                </div>
                            @endif






                            <div class="col text-center">
                                <form action="{{ route('api.proposal.printpdf', ['id' => $prop->proposalid])}}">
                                    <button id="btn_printproposall" type="submit" class="btn btn-success ">Download Pdf</button>

                                </form>
                            </div>




                        </div>
                        <div class="row form-group">
                            <h5 class="mt-1 text-center">Proposal Changes History</h5>

                        </div>
                        <div>
                            <table id="proposalchangestable"
                                class="table table-responsive table-bordered table-striped table-hover" style="margin:4px">
                                <thead class="bg-secondary text-white">
                                    <tr>
                                        <th scope="col">#No</th>
                                        <th scope="col">Issue</th>
                                        <th scope="col">Suggestion</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">By Who</th>
                                        <th scope="col">Date</th>
                                    </tr>
                                </thead>
                                <tbody>

                                </tbody>
                            </table>
                        </div>
                        <!-- proposal , change Modal -->
                        <div class="modal fade" id="proposalchangeModal" tabindex="-1" role="dialog"
                            aria-labelledby="proposalchangeLabel" aria-hidden="true">
                            <div class="modal-dialog" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="proposalchangeLabel">Suggest Change</h5>
                                        <button type="button" id="btn_close_proposalchangemodal" class="close"
                                            data-bs-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div class="modal-body">
                                        <form id="proposalchangeForm">
                                            @csrf
                                            <div class="form-group">
                                                <label for="item">Issue</label>
                                                <textarea type="text" class="form-control" id="issue" name="issue"
                                                    required></textarea>
                                            </div>
                                            <div class="form-group">
                                                <label for="quantity">Suggestion</label>
                                                <textarea type="text" class="form-control" id="suggestion" name="suggestion"
                                                    required></textarea>
                                            </div>
                                            <div class="form-group">
                                                <label for="unitprice">Status</label>
                                                <input type="text" class="form-control" value="Pending" id="unitprice" readonly>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary"
                                                    data-bs-dismiss="modal">Cancel</button>
                                                <button type="button" id="button_save_proposalchange"
                                                    class="btn btn-primary">Save</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- approve proposal Modal -->
                        <div class="modal fade" id="approveproposalModal" tabindex="-1" role="dialog"
                            aria-labelledby="approverejectproposalLabel" aria-hidden="true">
                            <div class="modal-dialog" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="approverejectproposalLabel"></h5>
                                        <button type="button" id="btn_close_approveproposalmodal" class="close"
                                            data-bs-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div class="modal-body">
                                        <form id="proposalapprovalForm">
                                            @csrf
                                            <div class="form-group">
                                                <label for="comment">Comment</label>
                                                <textarea type="text" class="form-control" id="comment" name="comment"
                                                    required></textarea>
                                            </div>
                                            <div class="form-group">
                                                <label for="comment">Funding Year</label>
                                                <select type="text" id="fundingfinyearfk" name="fundingfinyearfk"
                                                    class="form-control">
                                                    <option value="">Select a Financial Year</option>
                                                    @foreach ($finyears as $year)
                                                                                                                    <option value="{{ $year->id }}" {{ (isset($currentsettings) && $currentsettings['current_year'] == $year->id) ? 'selected' : '' }}>
                                                            {{ $year->id . ' -- (' . $year->finyear . ')'}}
                                                        </option>
                                                    @endforeach 
                                                                                    </select>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary"
                                                    data-bs-dismiss="modal">Cancel</button>
                                                <button type="button" id="button_approve_proposal"
                                                    class="btn btn-success">Approve</button>
                                                <button type="button" id="button_reject_proposal"
                                                    class="btn btn-danger">Reject</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <script>
                                // Script to handle the data attributes and pass them to the modal
                                $('#approveproposalModal').on('show.bs.modal', function (event) {
                                    var button = $(event.relatedTarget); // Button that triggered the modal
                                    var action = button.data('action'); // Extract info from data-* attributes 
                                    console.log(action);
                                    if (action == 'approve') {
                                        $('button_approve_proposal')?.setAttribute('visibility', 'visible')
                                        $('button_reject_proposal')?.setAttribute('visibility', 'hidden')
                                    }
                                });

                            </script>
                        </div>

                        <script>
                            $(document).ready(function () {


                                let proposalId = "{{ isset($prop) ? $prop->proposalid : '' }}"; // Check if proposalId is set
                                const receiveproposalurl = `{{ route('api.proposals.receiveproposal', ['id' => ':id']) }}`.replace(':id', proposalId.toString());
                                const proposalchangeurl = `{{ route('api.proposals.proposalchanges', ['id' => ':id']) }}`.replace(':id', proposalId.toString());
                                const approverejecturl = `{{ route('api.proposals.approvereject', ['id' => ':id']) }}`.replace(':id', proposalId.toString());
                                const enableediting = `{{ route('api.proposals.changeeditstatus', ['id' => ':id']) }}`.replace(':id', proposalId.toString());
                                var csrfToken = document.getElementsByName('_token')[0].value;

                               
                                //receive proposal
                                document.getElementById('btn_receiveproposal')?.addEventListener('click', function () {
                                    // Function to fetch data using AJAX
                                    $.ajax({
                                        url: receiveproposalurl,
                                        type: 'POST',
                                        data: { _token: csrfToken },
                                        dataType: 'json',
                                        success: function (response) {
                                            showtoastmessage(response);
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

                                //enable editing proposal
                                document.getElementById('_btn_enableproposalediting')?.addEventListener('click', function () {
                                    // Function to fetch data using AJAX
                                    $.ajax({
                                        url: enableediting,
                                        type: 'POST',
                                        data: { _token: csrfToken },
                                        dataType: 'json',
                                        success: function (response) {
                                            showtoastmessage(response);
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

                                //save proposal change
                                document.getElementById('button_save_proposalchange')?.addEventListener('click', function () {

                                    var formData = $('#proposalchangeForm').serialize();
                                    if (proposalId) {
                                        formData += '&proposalidfk=' + proposalId;
                                    }
                                    // Function to fetch data using AJAX
                                    $.ajax({
                                        url: "{{ route('api.proposalchanges.post') }}",
                                        type: 'POST',
                                        data: formData,
                                        dataType: 'json',
                                        success: function (response) {
                                            var closebtn = document.getElementById('btn_close_proposalchangemodal');
                                            if (closebtn) { closebtn.click(); }
                                            showtoastmessage(response);
                                            fetchproposalchanges();
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

                                document.getElementById('btn_openreject_proposalmodal')?.addEventListener('click', function () {
                                    var rejectbtn = document.getElementById('button_reject_proposal').hidden = false;
                                    var approvebtn = document.getElementById('button_approve_proposal').hidden = true;
                                    document.getElementById('approverejectproposalLabel').innerText = "Reject Proposal";
                                });
                                document.getElementById('btn_openapprove_proposalmodal')?.addEventListener('click', function () {
                                    var rejectbtn = document.getElementById('button_reject_proposal').hidden = true;
                                    var approvebtn = document.getElementById('button_approve_proposal').hidden = false;
                                    document.getElementById('approverejectproposalLabel').innerText = "Approve Proposal";

                                });
                                document.getElementById('button_approve_proposal')?.addEventListener('click', function () {
                                    approverejectproposal('Approved');
                                });
                                document.getElementById('button_reject_proposal')?.addEventListener('click', function () {
                                    approverejectproposal('Rejected');
                                });

                                function approverejectproposal(action) {
                                    var formData = $('#proposalapprovalForm').serialize();
                                    if (proposalId) {
                                        formData += '&proposalidfk=' + proposalId;
                                    }
                                    if (action) {
                                        formData += '&status=' + action;
                                    }
                                    // Function to fetch data using AJAX
                                    $.ajax({
                                        url: approverejecturl,
                                        type: 'POST',
                                        data: formData,
                                        dataType: 'json',
                                        success: function (response) {
                                            var closebtn = document.getElementById('btn_close_approveproposalmodal');
                                            if (closebtn) { closebtn.click(); }
                                            showtoastmessage(response);
                                            fetchproposalchanges();
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
                                }


                                // Function to fetch expenditures data 
                                function fetchproposalchanges() {
                                    $.ajax({
                                        url: proposalchangeurl,
                                        type: 'GET',
                                        dataType: 'json',
                                        success: function (response) {
                                            populateproposalchanges(response);
                                        },
                                        error: function (xhr, status, error) {
                                            console.error('Error fetching data:', error);
                                        }
                                    });
                                }

                                // Function to populate collaborators
                                function populateproposalchanges(data) {
                                    var tbody = $('#proposalchangestable tbody');
                                    tbody.empty(); // Clear existing table rows
                                    if (data.length > 0) {
                                        $.each(data, function (index, data) {
                                            var row = '<tr>' +
                                                '<td>' + data.changeid + '</td>' +
                                                '<td>' + data.triggerissue + '</td>' +
                                                '<td>' + data.suggestedchange + '</td>' +
                                                '<td>' + data.status + '</td>' +
                                                '<td>' + data.suggestedby?.name + '</td>' +
                                                '<td>' + new Date(data.created_at).toDateString('en-US') + '</td>' +
                                                '</tr>';
                                            tbody.append(row);
                                        });
                                    }
                                    else {
                                        var row = '<tr><td colspan="6" class="text-center">No Proposal Changes found</td></tr>';
                                        tbody.append(row);
                                    }
                                }

                                fetchproposalchanges();
                            });
                        </script>
                    </div>
                </div>
            </div>
        </div>
    @endif 
@endsection