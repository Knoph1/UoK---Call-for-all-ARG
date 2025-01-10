@extends('layouts.unauthorizedtemplate')

@section('content')
<div class="container">
    <section class="mt-2">
        <div class="container py-3 h-100">
            <div class="row d-flex justify-content-center align-items-center h-100">
                <div class="col-12 col-md-8 col-lg-6 col-xl-5">
                    <div class="card shadow-2-strong" style="border-radius: 1rem;">
                        <div class="card-body p-3 text-center">

                            <h4 class="mb-2">Sign in</h4>

                            <form method="POST" action="{{ route('login.submit') }}">
                                @csrf
                                <div class="form-outline mb-4">
                                    <input type="email" name="email" class="form-control form-control-md" />
                                    <label class="form-label" for="email">Email</label>
                                </div>

                                <div class="form-outline mb-3">
                                    <input type="password" name="password" class="form-control form-control-md" />
                                    <label class="form-label" for="password">Password</label>
                                </div>
                                @if($errors->has('email'))
                                    <div class="alert alert-danger">
                                        {{ $errors->first('email') }}
                                    </div>
                                @endif
                                <!-- Checkbox -->
                                <div class="form-check d-flex justify-content-start mb-4">
                                    <input class="form-check-input" type="checkbox" id="rememberme" />
                                    <label class="form-check-label" for="rememberme">Remember password </label>
                                </div>

                                <button class="btn btn-info btn-md btn-block col-12" type="submit">Login</button>
                            </form>


                            <hr class="my-2">
                            <div class="row col-12">
                                <div class="col-6">
                                    <a href="password/reset">Forgot Password?</a>
                                </div>
                                <div class="col-6">
                                    <a href="register">Register Here</a>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div>
</div>
</section>
</div>
@endsection