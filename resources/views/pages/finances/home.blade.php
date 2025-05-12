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
      <button class="nav-link active" id="nav-proposalschanges-tab" data-bs-toggle="tab" data-bs-target="#panel-proposalschanges"
        type="button" role="tab" aria-controls="panel-proposalschanges" aria-selected="true">Proposals Messages</button>
      <button class="nav-link" id="nav-security-tab" data-bs-toggle="tab" data-bs-target="#panel-security"
        type="button" role="tab" aria-controls="panel-security" aria-selected="false">Security</button>
      </div>
    </nav>

    <!-- Tab panes -->
    <div class="tab-content prop-tabpanel">
 
      <div role="tabpanel" class="tab-pane active" id="panel-proposalschanges">
     
      <script>
        $(document).ready(function () {
         let userid = "{{Auth::user()->userid}}"
        // Assuming prop is passed to the Blade view from the Laravel controller
        const basicupdateurl = `{{ route('api.users.updatebasicdetails', ['id' => ':id']) }}`.replace(':id', userid);
        document.getElementById('btn_editprofile')?.addEventListener('click', function () {

          document.getElementById('fullname').removeAttribute('readonly');
          document.getElementById('email').removeAttribute('readonly');
          document.getElementById('phonenumber').removeAttribute('readonly');
          document.getElementById('pfno').removeAttribute('readonly');
          document.getElementById('btn_updateprofile').removeAttribute('hidden');
          document.getElementById('btn_updateprofile').removeAttribute('disabled');
          this.disabled = true;
          this.hidden = true;
        });
        document.getElementById('btn_updateprofile')?.addEventListener('click', function () {

          var formData = $('#form_basicdetails').serialize();
          
          // Function to fetch data using AJAX
          $.ajax({
          url: basicupdateurl,
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
 
      <div role="tabpanel" class="tab-pane" id="panel-security">
     

      </div>

    </div>
    </div>


  </div>
@endauth
@endsection