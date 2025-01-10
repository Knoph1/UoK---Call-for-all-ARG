<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Controllers\MailingController;
use Illuminate\Http\Request;
use Auth;
use App\Models\User;
use Psy\Readline\Hoa\Console;

class LoginController extends Controller
{
    //
    public function subpermission(Request $request)
    {
        return response()->json($request);
    }
    public function showLoginForm()
    {
        if (Auth::check()) {
            // return response("authorised");
            return redirect()->route("pages.dashboard");
        } else {
            return view('pages.auth.login');

        }
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');
        $rememberme = $request->has('rememberme');
        if ($credentials['email'] == "admin@admin.com" && $credentials['password'] == "admin@123") {
            $adminexist = User::where('role', 1)->exists();
            if ($adminexist) {
                return redirect()->route('setupadmin');
            } else {
                // $request->session()->put('user_name', 'Developer'); // Store user name in session
                // $request->session()->put('user_id', 'admin@admin.com');// Store user email in session
                // return redirect()->intended('/dashboard');
            }
        }
        if (Auth::attempt($credentials, $rememberme)) {
            // Authentication passed... 
            $user = Auth::user();

            $request->session()->put('user_name', $user->name); // Store user name in session
            $request->session()->put('user_id', $user->email);// Store user email in session

          
            // Create an instance of MailingController and call the sendMail function
            // $mailingController = new MailingController();
            // $mailingController->sendMail($recipientEmail, $details);
            return redirect()->intended('/home');
        }


        // Authentication failed...
        return redirect()->route('pages.login')->withInput($request->only('email'))->withErrors([
            'email' => 'Invalid credentials. Please try again.',
        ]);
    }
}
