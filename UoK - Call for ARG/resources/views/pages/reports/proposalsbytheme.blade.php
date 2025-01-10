<div class="row">
    @auth

        <div class="row form-group" style="padding-top:4px">
            <form class="form">
                <div class="row ">
                    <div class="col col-6">
                        <div class="form-group">
                            <select id="bythemegrantselector" class="form-control form-select text-center filterback">
                                <option value="all" selected>All Grants</option>
                                @if (isset($allthemes))
                                    @foreach ($allthemes as $theme)
                                        <option value="{{ $theme->themeid }}">{{ $theme->themename }}</option>
                                    @endforeach
                                @endif                          
                            </select>
                        </div>
                    </div>
                    <div class="col col-6">
                        <div class="form-group">
                            <select id="bythemedepartmentselector" class="form-control form-select text-center filterback">
                                <option value="all" selected>All Departments</option>
                                @if (isset($alldepartments))
                                    @foreach ($alldepartments as $department)
                                        <option value="{{ $department->depid }}">{{ $department->shortname }}</option>
                                    @endforeach
                                @endif
                            </select>
                        </div>
                    </div>
                </div>
            </form>
            <div>
                <div class="chartcard">
                    <p class="text-center mt-2"><u><b>Theme Analysis Chart (Gender and Proposal Status)</b></u></p>
                    <div id="themecanvasparent" class="col-xs-12 " style="width: 99%;height: 300px;margin:8px">
                        <canvas id="themeanalysischart" style="width: 100%; height: 100%;"></canvas>
                    </div>
                </div>
            </div>
        </div>
    @endauth
</div>
<script>
    $(document).ready(function () {

        var routeUrlTemplate = "{{ route('pages.proposals.viewproposal', ['id' => '__ID__']) }}";
        let grant = null;
        let department = null;
        // Event listener for grant selector
        $('#bythemegrantselector').change(function () {
            grant = this.value === 'all' ? null : this.value;
            fetchData(grant, department);
        });

        // Event listener for theme selector
        $('#bythemedepartmentselector').change(function () {
            department = this.value === 'all' ? null : this.value;
            fetchData(grant, department);
        }); 
        // Function to search data using AJAX
        function fetchData(grantfilter, departmentfilter) {
            let query = { filtergrant: grantfilter, filterdepartment: departmentfilter };

            $.ajax({
                url: "{{ route('api.reports.proposals.bytheme') }}",
                type: 'GET',
                dataType: 'json',
                data: query,
                success: function (response) {
                    populatebythemesChart(response);
                },
                error: function (xhr, status, error) {
                    console.error('Error searching data:', error);
                }
            });
        }

        // Function to populate the chart
        function populatebythemesChart(data) {
            const canvas = document.getElementById('themeanalysischart');
            const ctx = canvas.getContext('2d');

            // Destroy existing chart instance if it exists
            if (Chart.getChart(canvas)) {
                Chart.getChart(canvas).destroy();
            }

            new Chart(ctx, {
                type: 'bar',
                data: data,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        // Initial fetch when the page loads
        fetchData(null, null);

    });


</script>