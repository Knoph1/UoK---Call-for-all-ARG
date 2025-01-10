@extends('layouts.master')

@section('content')
<div class="row">
    @if (isset($department))
        <div class="row form-group">
            <div class="form col-12 m-3">

                <form method="POST" id="departmentdetailsform" enctype="multipart/form-data" class="form-horizontal">
                    @csrf
                    <div class="row form-groupn mb-2">
                        <div class="col col-md-3">
                            <label class="form-control-label">Name</label>
                        </div>
                        <div class="col-12 col-md-9">
                            <input type="text" id="shortname" name="shortname" placeholder="Department Name"
                                value="{{ $department->shortname }}" class="form-control" readonly>
                        </div>
                    </div>

                    <div class="row form-groupn mb-2">
                        <div class="col col-md-3">
                            <label class="form-control-label">Name</label>
                        </div>
                        <div class="col-12 col-md-9">
                            <select type="text" id="schoolfk" name="schoolfk" placeholder="School"
                                class="form-control"  disabled>
                                <option value="">Select a School</option>
                                @foreach ($schools as $schoolitem)
                                    <option value="{{ $schoolitem->schoolid }}" {{ (isset($department) && $department->schoolfk == $schoolitem->schoolid) ? 'selected' : '' }}>
                                        {{ $schoolitem->schoolname }}
                                    </option>

                                @endforeach 
                            </select>
                        </div>
                    </div>

                    <div class="row form-group mb-2">
                        <div class="col col-md-3">
                            <label class="form-control-label">Description</label>
                        </div>
                        <div class="col-12 col-md-9">
                            <input type="text" id="description" name="description" placeholder="Description"
                                value="{{ $department->description }}" class="form-control" readonly>
                        </div>
                    </div>
                    @if (auth()->user()->haspermission('caneditdepartment'))
                        <div class="row form-group mt-2">
                            <div class="col text-center">
                                <button id="btn_editdepartment" type="button" class="btn btn-info">Edit Department</button>

                                <button id="btn_updatedepartment" type="button" class="btn btn-success" disabled hidden>Update
                                    Department</button>
                            </div>
                        </div>
                    @endif
                </form>

                <script>
                    $(document).ready(function () {

                        let depid = "{{ isset($department) ? $department->depid : '' }}"; // Check if depid is set
                        // Assuming prop is passed to the Blade view from the Laravel controller
                        const depurl = `{{ route('api.departments.updatedepartment', ['id' => ':id']) }}`.replace(':id', depid);
                        document.getElementById('btn_editdepartment')?.addEventListener('click', function () {

                            document.getElementById('shortname').removeAttribute('readonly');
                            document.getElementById('schoolfk').removeAttribute('disabled');
                            document.getElementById('description').removeAttribute('readonly');
                            document.getElementById('btn_updatedepartment').removeAttribute('hidden');
                            document.getElementById('btn_updatedepartment').removeAttribute('disabled');
                            this.disabled = true;
                            this.hidden = true;
                        });
                        document.getElementById('btn_updatedepartment')?.addEventListener('click', function () {

                            var formData = $('#departmentdetailsform').serialize();

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