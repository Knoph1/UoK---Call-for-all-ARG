<div class="row">

    @auth
        <div class="row form-group" style="padding-top: 4px;">
            <form class="form">
                <div class="row">
                    <div class="col col-6">
                        <div class="form-group">
                            <select id="byschoolgrantselector" class="form-control form-select text-center filterback">
                                <option selected value="all">All Grants</option>
                                @if (isset($allgrants))
                                    @foreach ($allgrants as $grant)
                                        <option value="{{ $grant->grantid }}">{{ $grant->title }} - {{ $grant->finyear }}</option>
                                    @endforeach
                                @endif
                            </select>
                        </div>
                    </div>
                    <div class="col col-6">
                        <div class="form-group">
                            <select id="byschoolthemeselector" class="form-control form-select text-center filterback">
                                <option selected value="all">All Themes</option>
                                @if (isset($allthemes))
                                    @foreach ($allthemes as $theme)
                                        <option value="{{ $theme->themeid }}">{{ $theme->themename }}</option>
                                    @endforeach
                                @endif
                            </select>
                        </div>
                    </div>
                </div>
            </form>
            <div>
                <div class="chartcard">
                    <p class="text-center mt-2"><u><b>Department Analysis Chart (Gender and Proposal Status)</b></u></p>
                    <div id="canvasparent" class="col-xs-12" style="width: 99%; height: 300px; margin: 8px;">
                        <canvas id="schoolanalysischart" style="width: 100%; height: 100%;"></canvas>
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
        let theme = null;

        // Event listener for grant selector
        $('#byschoolgrantselector').change(function () {
            grant = this.value === 'all' ? null : this.value;
            fetchbyschoolData(grant, theme);
        });

        // Event listener for theme selector
        $('#byschoolthemeselector').change(function () {
            theme = this.value === 'all' ? null : this.value;
            fetchbyschoolData(grant, theme);
        });

        // Function to search data using AJAX
        function fetchbyschoolData(grantfilter, themefilter) {
            let query = {
                filtergrant: grantfilter,
                filtertheme: themefilter
            };

            $.ajax({
                url: "{{ route('api.reports.proposals.byschool') }}",
                type: 'GET',
                dataType: 'json',
                data: query,
                success: function (response) {
                    populatebyschoolChart(response);
                },
                error: function (xhr, status, error) {
                    console.error('Error fetching data:', error);
                }
            });
        }

        // Function to populate the chart
        function populatebyschoolChart(data) {
            const canvas = document.getElementById('schoolanalysischart');
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

        // Initial data fetch
        fetchbyschoolData(null, null);
    });
</script>