<div class="row">


    @auth

        <div class="row form-group" style="padding-top:4px">
            <form class="form">
                <div class="row ">
                    <div class="col col-6">
                        <div class="form-group">
                            <select id="generalthemeselector" class="form-control form-select text-center filterback">
                                <option value="all" selected>All Themes</option>
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
                            <select id="generaldepartmentselector" class="form-control form-select text-center filterback">
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
                    <div class="col-xs-12 " style="width: 99%;height: 300px;margin:8px">
                        <canvas id="generalanalysischart" style="width: 100%; height: 100%;"></canvas>
                    </div>
                </div>
            </div>
        </div>
    @endauth
</div>
<script>
    $(document).ready(function () {

        let theme = null;
        let department = null;
        // Event listener for theme selector
        $('#generalthemeselector').change(function () {
            theme = this.value === 'all' ? null : this.value;
            fetchData(theme, department);
        });

        // Event listener for department selector
        $('#generaldepartmentselector').change(function () {
            department = this.value === 'all' ? null : this.value;
            fetchData(theme, department);
        });
        // Function to search data using AJAX
        function fetchData(themefilter, departmentfilter) {
            let query = { filtertheme: themefilter, filterdepartment: departmentfilter };

            $.ajax({
                url: "{{ route('api.reports.proposals.bygrant') }}",
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
            const canvas = document.getElementById('generalanalysischart');
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
                    },
                    plugins: {
                        decimation: {
                            enabled: false,
                            algorithm: 'min-max',
                        },
                    },
                }
            });
        }

        // Initial fetch when the page loads
        fetchData(null, null);

    });


</script>