<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="ARG Portal">
  <meta name="author" content="Tagile Solutions">
  <link rel="icon" href="{{ asset('images/favicon.png') }}" type="image/x-icon">
  <title>U.O.K ARG Portal</title>
  @include('partials.scripts')
  @include('partials.styles')
</head>

<body style="background-color: #eee;">

  <div id="right-panel" class="right-panel" style="margin-left:0px">
    @include('partials.header')
    <main class="content">
      <div id="mapCanvas" class="align-items-center" style="height:100vh - 32px">
        @yield('content')        
      </div>
      @include('partials.footer')
    </main>
  </div>

  @include('partials.scripts')



</body>

</html>