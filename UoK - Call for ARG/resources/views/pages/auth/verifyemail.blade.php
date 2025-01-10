@extends('layouts.master')

@section('content')
<div class="row">
    @if (Auth::check() && !Auth::user()->hasVerifiedEmail())
        <div class="row text-center mt-5">
            <h3>Verify Your Email Address!</h3>

            @if (session('verificationstatus') == 'verification-link-sent')
                <p>Please check your email for a verification link. If you didn't receive it,</p>
                <p>don't worry, you can try again in a few moments.</p>
            @else
                <p>Click the button below to get a verification link.</p>
            @endif 
            <form method="POST" action="{{ route('verification.resend') }}">
                @csrf
                <button type="submit" class="btn btn-outline-primary" id="resendButton">Get Verification Link</button>
            </form> 
            <p id="timer" hidden class="mt-1 font-weight-bold"><b></b></p>
        </div>
    @else
        <div class="row text-center mt-5">
            <h1>Your email has already been verified</h1>
            <a href="{{ route('pages.dashboard') }}" class="btn btn-primary mt-3">Go back to Dashboard</a>
        </div>
    @endif
</div> 
<script>
    $(document).ready(function () {
        const resendButton = document.getElementById('resendButton');
        const timerDisplay = document.getElementById('timer');
        let timer;

        @if (session('verificationstatus') == 'verification-link-sent') 
            const disableUntil = new Date(new Date().getTime() +  30000); //  30 seconds from now
            localStorage.setItem('resendDisabledUntil', disableUntil);
            disableButton(disableUntil);
            timerDisplay.removeAttribute('hidden');
        @endif

        resendButton.addEventListener('click', function(event) {
            event.preventDefault();
            const disableUntil = new Date(new Date().getTime() + 30000); // 30 seconds from now
            localStorage.setItem('resendDisabledUntil', disableUntil);
            // disableButton(disableUntil);
            this.closest('form').submit();
            sessionStorage.removeItem('verificationstatus');
            timerDisplay.setAttribute('hidden');

        });

        function disableButton(disableUntil) {
            resendButton.disabled = true;
            timerDisplay.textContent = `Please wait ${formatTime(disableUntil - new Date())} to resend.`;

            timer = setInterval(() => {
                const remaining = disableUntil - new Date();
                if (remaining <= 0) {
                    clearInterval(timer);
                    resendButton.disabled = false;
                    timerDisplay.textContent = '';
                    localStorage.removeItem('resendDisabledUntil');
                } else {
                    timerDisplay.textContent = `Please wait ${formatTime(remaining)} to try again.`;
                }
            }, 1000);
        }

        function formatTime(milliseconds) {
            const totalSeconds = Math.floor(milliseconds / 1000);
            const seconds = totalSeconds % 60;
            return `${seconds}s`;
        }
    });
</script>
@endsection
