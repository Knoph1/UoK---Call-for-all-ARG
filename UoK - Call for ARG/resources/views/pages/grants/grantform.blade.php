@extends('layouts.master')

@section('content')
<div class="row">
   @if (isset($grant))
        <div class="row form-group" >
        <div  class="form col-12 m-3" >
            <!-- basic Details Form -->
            <form method="POST" id="grantdetailsform" enctype="multipart/form-data" class="form-horizontal">
                @csrf
                <div class="row form-groupn mb-2">
                    <div class="col col-md-3">
                        <label class="form-control-label">Grant Title</label>
                    </div>
                    <div class="col-12 col-md-9">
                        <input type="text" id="title" name="title" placeholder="Grant Title"
                            value="{{ $grant->title }}" class="form-control" readonly>
                    </div>
                </div>

                <div class="row form-group mb-2">
                    <div class="col col-md-3">
                        <label class="form-control-label">Fin Year</label>
                    </div>
                    <div class="col-12 col-md-9">
                        <input type="text" id="finyear" name="finyear" placeholder="Financial Year"
                            value="{{ $grant->finyear }}" class="form-control" readonly>
                    </div>
                </div>

                <div class="row form-group mb-2">
                    <div class="col col-md-3">
                        <label class="form-control-label">Status</label>
                    </div>
                    <div class="col-12 col-md-9">
                        <select type="text" id="status" name="status" value="{{ $grant->status }}" class="form-control" readonly disabled>
                            <option value="">Select Status</option>
                            <option value="Open" {{ (isset($grant) && $grant->status == "Open") ? 'selected' : '' }}>Open</option>
                            <option value="Closed" {{ (isset($grant) && $grant->status == "Closed") ? 'selected' : '' }}>Closed</option>
                            </select>
                    </div>
                </div>
                @if (auth()->user()->haspermission('caneditgrant'))
                <div class="row form-group mt-2">
                    <div class="col text-center">
                        <button id="btn_editgrant" type="button" class="btn btn-info">Edit Grant</button>

                        <button id="btn_updategrant" type="button" class="btn btn-success" disabled hidden>Update Grant</button>
                    </div>
                </div>
                @endif
            </form>

            <script>
                $(document).ready(function () {

                    let grantid = "{{ isset($grant) ? $grant->grantid : '' }}"; // Check if grantid is set
                    // Assuming prop is passed to the Blade view from the Laravel controller
                    const granturl = `{{ route('api.grants.updategrant', ['id' => ':id']) }}`.replace(':id', grantid);
                    document.getElementById('btn_editgrant')?.addEventListener('click', function () {

                        document.getElementById('title').removeAttribute('readonly');
                        document.getElementById('finyear').removeAttribute('readonly');
                        document.getElementById('status').removeAttribute('readonly'); 
                        document.getElementById('status').removeAttribute('disabled'); 
                        document.getElementById('btn_updategrant').removeAttribute('hidden');
                        document.getElementById('btn_updategrant').removeAttribute('disabled');
                        this.disabled = true;
                        this.hidden = true;
                    });
                    document.getElementById('btn_updategrant')?.addEventListener('click', function () {

                        var formData = $('#grantdetailsform').serialize();
                        
                        // Function to fetch data using AJAX
                        $.ajax({
                            url: granturl,
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
    @endif 
</div> 
@endsection