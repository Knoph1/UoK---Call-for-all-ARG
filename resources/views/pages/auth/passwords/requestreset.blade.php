@extends('layouts.unauthorizedtemplate')

@section('content')
<div class="container">
    <section class="mt-2 mb-4">
        <div class="container py-3 h-100">
            <form action="{{ route('password.requestreset') }}" method="POST">
                @csrf
                <input type="email" name="email" required placeholder="Email">
                <button type="submit">Send Password Reset Link</button>
            </form>
            @if (session('status'))
                <div>{{ session('status') }}</div>
            @endif
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