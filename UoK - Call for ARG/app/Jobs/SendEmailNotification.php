<?php
namespace App\Jobs;

use App\Notifications\CustomNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Log;

class SendEmailNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $email;
    protected $notification;

    public function __construct($email, $notification)
    {
        $this->email = $email;
        $this->notification = $notification;
    }

    public function handle()
    {
        Notification::route('mail', $this->email)->notify($this->notification);
    }

    public function failed(\Exception $exception)
    {
        Log::error("Failed to send email to {$this->email}: " . $exception->getMessage());
        // Handle the error, such as updating a database record
    }
}
