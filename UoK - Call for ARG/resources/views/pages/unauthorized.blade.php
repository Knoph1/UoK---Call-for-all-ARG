@extends('layouts.master')

@section('content')
<div class="container mt-5">
   <div class="row justify-content-center ">
      <div class=" col-4 text-center" style="padding-right:0px">
         @auth 
          <div class="card">
            <div class="card-header">
               <h5>Warning Message</h5>
            </div>
            <div class="card-body text-danger">
               @if (isset($message))
               <b>{{$message}}</b>
            @endif
            </div>

          </div>
       @endauth
      </div>
   </div>
</div>
@endsection