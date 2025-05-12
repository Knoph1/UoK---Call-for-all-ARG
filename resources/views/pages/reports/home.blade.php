@extends('layouts.master')

@section('content')
<div class="row">
    <div class="text-center">All reports</div>
    <div class="prop-tabcontainer">
        <!-- Nav tabs -->
        <nav>
            <div class="nav nav-tabs" id="nav-tab" role="tablist">
                <button class="nav-link active" id="nav-allproposals-tab" data-bs-toggle="tab"
                    data-bs-target="#panel-allproposals" type="button" role="tab" aria-controls="panel-allproposals"
                    aria-selected="true">Proposals</button>
                <button class="nav-link" id="nav-byschool-tab" data-bs-toggle="tab" data-bs-target="#panel-byschool"
                    type="button" role="tab" aria-controls="panel-byschool" aria-selected="false">Department
                    Analysis</button>
                <button class="nav-link" id="nav-bytheme-tab" data-bs-toggle="tab" data-bs-target="#panel-bytheme"
                    type="button" role="tab" aria-controls="panel-bytheme" aria-selected="false">Theme Analysis</button>
                <button class="nav-link" id="nav-bygrantyear-tab" data-bs-toggle="tab"
                    data-bs-target="#panel-bygrantyear" type="button" role="tab" aria-controls="panel-bygrantyear"
                    aria-selected="false">Grant/Year Analysis</button>
            </div>
        </nav>

        <!-- Tab panes -->
        <div class="tab-content prop-tabpanel">
            <!-- All proposals -->
            <div role="tabpanel" class="tab-pane active" id="panel-allproposals">
                @include('pages.reports.allproposals')
            </div>


            <!-- byschool tab -->
            <div role="tabpanel" class="tab-pane" id="panel-byschool">
                @include('pages.reports.proposalsbyschool')
            </div>
            <!-- bytheme tab -->
            <div role="tabpanel" class="tab-pane" id="panel-bytheme">
            @include('pages.reports.proposalsbytheme')
            </div>


            <!-- bygrantyear tab -->
            <div role="tabpanel" class="tab-pane" id="panel-bygrantyear">
            @include('pages.reports.proposalsbygrantandyear')
            </div> 
        </div>
    </div>
</div>
</div>
@endsection