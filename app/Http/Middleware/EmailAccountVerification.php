<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class EmailAccountVerification
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Check if the user is authenticated but not email verified
        if (Auth::check() && !Auth::user()->hasVerifiedEmail()) {
            // Redirect to the specified route
            return redirect()->route('pages.account.verifyemail');
        }

        return $next($request);
    }
}

