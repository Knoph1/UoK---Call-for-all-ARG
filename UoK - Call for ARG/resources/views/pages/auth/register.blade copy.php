@extends('layouts.unauthorizedtemplate')

@section('content')
<section>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">{{ __('Registration Here') }}</div>

                    <div class="card-body">
                        <form method="POST" action="{{ route('register.submit') }}">
                            @csrf
                            <div class="form-group row">
                                <label for="fullname"
                                    class="col-md-4 col-form-label text-md-right">{{ __('Full Name') }}</label>

                                <div class="col-md-6">
                                    <input id="fullname" class="form-control @error('fullname') is-invalid @enderror"
                                        name="fullname" required autocomplete="fullname" autofocus>

                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="pfno"
                                    class="col-md-4 col-form-label text-md-right">{{ __('PF Number') }}</label>

                                <div class="col-md-6">
                                    <input id="pfno" class="form-control @error('fullname') is-invalid @enderror"
                                        name="pfno" required autocomplete="pfno" autofocus>

                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="email"
                                    class="col-md-4 col-form-label text-md-right">{{ __('E-Mail Address') }}</label>

                                <div class="col-md-6">
                                    <input id="email" type="email"
                                        class="form-control @error('email') is-invalid @enderror" name="email"
                                        value="{{ old('email') }}" required autocomplete="email" autofocus>

                                    @error('email')
                                        <span class="invalid-feedback" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="phonenumber"
                                    class="col-md-4 col-form-label text-md-right">{{ __('Phone Number') }}</label>

                                <div class="col-md-6">
                                    <input id="phonenumber" class="form-control @error('phonenumber') is-invalid @enderror"
                                        name="phonenumber" required autofocus>

                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="password"
                                    class="col-md-4 col-form-label text-md-right">{{ __('Password') }}</label>

                                <div class="col-md-6">
                                    <input id="password" type="password"
                                        class="form-control @error('password') is-invalid @enderror" name="password"
                                        required autocomplete="current-password">

                                    @error('password')
                                        <span class="invalid-feedback" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>
                            </div>

                            <div class="form-group row">
                                <label for="password"
                                    class="col-md-4 col-form-label text-md-right">{{ __('Repeat Password') }}</label>

                                <div class="col-md-6">
                                    <input id="password2" type="password"
                                        class="form-control @error('password') is-invalid @enderror" name="password2"
                                        required autocomplete="current-password">

                                    @error('password')
                                        <span class="invalid-feedback" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>
                            </div>


                            <div class="form-group row mb-0">
                                <div class="col-md-8 offset-md-4">
                                    <button type="submit" class="btn btn-primary">
                                        {{ __('Register') }}
                                    </button>

                                </div>
                            </div>

                            <div class="form-group row mb-0">
                                <div>Have an account ? <a href="login">Login Here</a></div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
@endsection