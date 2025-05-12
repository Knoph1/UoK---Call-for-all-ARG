<div class="row">
    <style>
        #searchInput::placeholder {
            color: #cdc8c8;
            /* Change to your desired color */
        }
    </style>

    @auth

        <div class="row form-group" style="padding-top:4px">
            <div class="form-group">
                <input type="text" id="searchInput" class="form-control text-center" style="::placeholder { color: red; }"
                    placeholder="Search by Applicant Name, Theme name, Status or Department Name">
            </div>

            <table id="proposalstable" class="table table-responsive table-bordered table-striped table-hover"
                style="margin:4px">
                <thead class="bg-secondary text-white">
                    <tr>
                        <th scope="col">#NO</th>
                        <th scope="col">Applicant</th>
                        <th scope="col">Grant No</th>
                        <th scope="col">Theme</th>
                        <th scope="col">Qualification</th>
                        <th scope="col">Department</th>
                        <th scope="col">Submitted?</th>
                        <th scope="col">Date</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
    @endauth
</div>
<script>
    $(document).ready(function () {

        var routeUrlTemplate = "{{ route('pages.proposals.viewproposal', ['id' => '__ID__']) }}";
        // Function to search data using AJAX
        function searchData(searchTerm) {
            let query={};
            if (searchTerm != '') {
                query = {
                    search: searchTerm
                }
            }

            $.ajax({
                url: "{{ route('api.reports.proposals.all') }}",
                type: 'GET',
                dataType: 'json',
                data: query,
                success: function (response) {

                    populateTable(response);
                },
                error: function (xhr, status, error) {
                    console.error('Error searching data:', error);
                }
            });
        }

        // Function to populate table with data
        function populateTable(data) {
            var tbody = $('#proposalstable tbody');
            tbody.empty(); // Clear existing table rows
            if (data.length > 0) {
                $.each(data, function (index, data) {
                    var proposalUrl = routeUrlTemplate.replace('__ID__', data.proposalid);
                    var row = '<tr>' +
                        '<td><a class="nav-link pt-0 pb-0" href="' + proposalUrl + '">' + data.proposalcode + '</a></td>' +
                        '<td>' + data.applicant.name + '</td>' +
                        '<td>' + (data.grantitem ? data.grantitem.grantid + ' - (' + data.grantitem.finyear + ')' : '') + '</td>' +
                        '<td>' + (data.themeitem ? data.themeitem.themename : '') + '</td>' +
                        '<td>' + data.highqualification + '</td>' +
                        '<td>' + (data.department ? data.department.shortname : '') + '</td>' +
                        '<td>' + (data.submittedstatus == 1 ? "Yes" : "No") + '</td>' +
                        '<td>' + new Date(data.created_at).toDateString("en-US") + '</td>' +
                        '</tr>';
                    tbody.append(row);
                });
            }
            else {
                var row = '<tr><td colspan="8" class="text-center text-dark"><b>No Applications found</b></td></tr>';
                tbody.append(row);
            }
        }

        // Initial fetch when the page loads
        searchData('');

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