@extends('layouts.master')

@section('content')
<div class="row">
    @if (isset($school))
        <div class="row form-group">
            <div class="form col-12 m-3">

                <form method="POST" id="schooldetailsform" enctype="multipart/form-data" class="form-horizontal">
                    @csrf
                    <div class="row form-groupn mb-2">
                        <div class="col col-md-3">
                            <label class="form-control-label">Name</label>
                        </div>
                        <div class="col-12 col-md-9">
                            <input type="text" id="schoolname" name="schoolname" placeholder="School Name"
                                value="{{ $school->schoolname }}" class="form-control" readonly>
                        </div>
                    </div> 
                    <div class="row form-group mb-2">
                        <div class="col col-md-3">
                            <label class="form-control-label">Description</label>
                        </div>
                        <div class="col-12 col-md-9">
                            <input type="text" id="description" name="description" placeholder="Description"
                                value="{{ $school->description }}" class="form-control" readonly>
                        </div>
                    </div>
                    @if (auth()->user()->haspermission('canaddoreditschool'))
                        <div class="row form-group mt-2">
                            <div class="col text-center">
                                <button id="btn_editschool" type="button" class="btn btn-info">Edit School</button>

                                <button id="btn_updateschool" type="button" class="btn btn-success" disabled hidden>Update
                                    Department</button>
                            </div>
                        </div>
                    @endif
                </form>

                <script>
                    $(document).ready(function () {

                        let schoolid = "{{ isset($school) ? $school->schoolid : '' }}"; // Check if depid is set
                        // Assuming prop is passed to the Blade view from the Laravel controller
                        const depurl = `{{ route('api.schools.updateschool', ['id' => ':id']) }}`.replace(':id', schoolid);
                        document.getElementById('btn_editschool')?.addEventListener('click', function () {

                            document.getElementById('schoolname').removeAttribute('readonly');
                            document.getElementById('description').removeAttribute('readonly');
                            document.getElementById('btn_updateschool').removeAttribute('hidden');
                            document.getElementById('btn_updateschool').removeAttribute('disabled');
                            this.disabled = true;
                            this.hidden = true;
                        });
                        document.getElementById('btn_updateschool')?.addEventListener('click', function () {

                            var formData = $('#schooldetailsform').serialize();

                            // Function to fetch data using AJAX
                            $.ajax({
                                url: depurl,
                                type: 'POST',
                                data: formData,
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
                    });
                </script>
            </div>
        </div>
    @endif </div>
@endsection