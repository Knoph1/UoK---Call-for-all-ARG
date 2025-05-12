@extends('layouts.unauthorizedtemplate')

@section('content')
<div class="container">
    <section class="mt-2 mb-4">
        <div class="container py-3 h-100 text-center">
        <form action="{{ route('password.update') }}" method="POST">
        @csrf
        <input type="hidden" name="token" value="{{ $token }}"><br/>
        <input type="email" name="email" required placeholder="Email"><br/>
        <input type="password" name="password" required placeholder="New Password"><br/>
        <input type="password" name="password_confirmation" required placeholder="Confirm Password"><br/>
        <button type="submit">Reset Password</button>
    </form>
    @if ($errors->any())
        <div>
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif
        </div>
    </section>
</div>
@endsection