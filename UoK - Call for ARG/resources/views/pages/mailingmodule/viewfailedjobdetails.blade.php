@extends('layouts.master')

@section('content')
@auth
  @if (isset($job))
    <div class="row ">
    <div class="form-group">

    <form method="POST" id="jobdetailsform" enctype="multipart/form-data" class="form-horizontal">
      @csrf
      <div class="row form-groupn mb-2">
      <div class="col col-md-2">
      <label class="form-control-label">Queue</label>
      </div>
      <div class="col-12 col-md-10">
      <input type="text" value="{{ $job->queue }}" class="form-control" readonly>
      </div>
      </div>

      <div class="row form-groupn mb-2">
      <div class="col col-md-2">
      <label class="form-control-label">Exception</label>
      </div>
      <div class="col-12 col-md-10">
      <textarea type="text" class="form-control" rows="10" readonly>{{ $job->exception }}</textarea>
      </div>
      </div>

      <div class="row form-group mb-2">
      <div class="col col-md-2">
      <label class="form-control-label">Payload</label>
      </div>
      <div class="col-12 col-md-10">
      <textarea type="text" class="form-control" rows="10" readonly>{{ $job->payload }}</textarea>
      </div>
      </div>
      @if (auth()->user()->haspermission('mailingmodule'))
      <div class="row form-group mt-2">
      <div class="col text-center">
      <button id="btn_startjob" type="button" class="btn btn-info">Start</button>

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
@endauth
@endsection