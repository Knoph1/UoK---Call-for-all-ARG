<?php

namespace App\Http\Controllers;

use App\Jobs\SendEmailNotification;
use App\Mail\VerificationMail;
use App\Models\NotificationType;
use App\Models\Permission;
use App\Models\Proposal;
use App\Models\User;
use App\Notifications\GeneralProposalAction;
use App\Notifications\ProposalApprovedNotification;
use App\Notifications\ProposalReceivedNotification;
use App\Notifications\ProposalSubmitted;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Notification;

class MailingController extends Controller
{
    //
    public function sendMail($recipients, $details)
    {

        try {
            if (count($recipients) === 1) {
                Mail::to($recipients)->send(new VerificationMail($details));
                // return [
                //     'issuccess' => true,
                //     'message' => 'Mail sent successfully.'
                // ];
                return response()->json(['issuccess' => true, 'message' => 'Mail sent successfully!'], 200);

            } else {
                // Queue emails for multiple recipients
                foreach ($recipients as $recipient) {
                    Mail::to($recipients)->queue(new VerificationMail($details));

                }
                return response()->json(['issuccess' => true, 'message' => 'Emails are being sent!'], 200);
            }

        } catch (Exception $e) {
            Log::error('Mail sending failed: ' . $e->getMessage());
            return [
                'issuccess' => false,
                'message' => 'Failed to send the mail: ' . $e->getMessage()
            ];
        }

    }

    public function sendbulkMail($recipientsEmail, $details)
    {

        try {
            Mail::to($recipientsEmail)->send(new VerificationMail($details));
            return [
                'issuccess' => true,
                'message' => 'Mail sent successfully.'
            ];
        } catch (Exception $e) {
            Log::error('Mail sending failed: ' . $e->getMessage());
            return [
                'issuccess' => false,
                'message' => 'Failed to send the mail: ' . $e->getMessage()
            ];
        }

    }

    //getmails with permission
    public function getEmailsByPermission($permissionId)
    {
        // Fetch emails of users who have the specified permission
        $emails = User::whereHas('permissions', function ($query) use ($permissionId) {
            $query->where('permissionidfk', $permissionId);
        })->get();

        return $emails;
    }

    public function notifyusersnewProposal($proposal)
    {
        if (Permission::where('shortname', 'cangetnewproposalnotification')->exists()) {
            $permission = Permission::where('shortname', 'cangetnewproposalnotification')->first();
            $users = $this->getEmailsByPermission($permission->pid); //->pluck('email')->toArray()
            $emails = $this->getEmailsByPermission($permission->pid)->pluck('email')->toArray();
            // Define the data for the notification
            $level = 'success';
            $introLines = ['You have a new notification for submitted Proposal', 'Want to have a look? Click the button below.'];
            $actionUrl = route('pages.proposals.viewproposal', ['id' => $proposal->proposalid]);
            $actionText = 'View proposal';
            $outroLines = ['If you received this message mistakenly, Kindly Ignore and report to the Administrator to prevent receiving this mail again in future.'];
            $salutation = 'Best Regards';
            $subject = 'New Proposal';

            // Send the notification to all email addresses
            foreach ($users as $user) {
                try {
                    // notification instance
                    $personName = $user->name;
                    $greeting = 'Hello Dear, ' . $personName;
                    $notification = new ProposalSubmitted($subject, $greeting, $level, $introLines, $actionUrl, $actionText, $outroLines, $salutation);
                    // Notification::route('mail', $user->email)->notify($notification);
                    SendEmailNotification::dispatch($user->email, $notification);
                } catch (Exception $e) {
                    Log::error("Failed to send email to {$user->email}: " . $e->getMessage());
                    // Handle the error accordingly, such as updating a database record
                }

            }
        }



    }



    //notify owner of their proposal being received
    public function notifyUserReceivedProposal($proposal)
    {
        try { 
            $user = User::findOrFail($proposal->useridfk);
            if ($user) {
                // Define the data for the notification
                $level = 'success';
                $introLines = ['Your Proposal has been has been received by the committee!', 'Your proposal will now udergo the review process and you will be informed for any activity within your proposal.'];
                $actionUrl = route('pages.proposals.viewproposal', ['id' => $proposal->proposalid]);
                $actionText = 'View proposal';
                $outroLines = ['If you received this message mistakenly, Kindly Ignore and report to the Administrator to prevent receiving this mail again in future.'];
                $salutation = 'Best Regards';
                $subject = 'Proposal Received!';

                // Send the notification 
                try {
                    // notification instance
                    $personName = $user->name;
                    $greeting = 'Hello, ' . $personName;
                    $notification = new ProposalReceivedNotification($subject, $greeting, $level, $introLines, $actionUrl, $actionText, $outroLines, $salutation);
                    // Notification::route('mail', $user->email)->notify($notification);
                    SendEmailNotification::dispatch($user->email, $notification);
                } catch (Exception $e) {
                    Log::error("An error occurred while sending the proposal received notification: " . $e->getMessage());
                    // Handle the error accordingly, such as updating a database record
                }
            }
        } catch (Exception $e) {

        }



    }
    //notify users of their proposal approval
    public function notifyusersapprovedproposal($proposal)
    {
        try { 
            $user = User::findOrFail($proposal->useridfk);
            if ($user) {
                // Define the data for the notification
                $level = 'success';
                $introLines = ['Your Proposal has been reviewed, revised and Approved by the Committee!', 'You have the pleasure for further directives to kickstart your research and Impact Lives.'];
                $actionUrl = route('pages.proposals.viewproposal', ['id' => $proposal->proposalid]);
                $actionText = 'View proposal';
                $outroLines = ['If you received this message mistakenly, Kindly Ignore and report to the Administrator to prevent receiving this mail again in future.'];
                $salutation = 'Best Regards';
                $subject = 'Congratulations ' . $user->name;

                // Send the notification 
                try {
                    // notification instance
                    $personName = $user->name;
                    $greeting = 'Bravo!, ' . $personName;
                    $notification = new ProposalApprovedNotification($subject, $greeting, $level, $introLines, $actionUrl, $actionText, $outroLines, $salutation);
                    // Notification::route('mail', $user->email)->notify($notification);
                    SendEmailNotification::dispatch($user->email, $notification);
                } catch (Exception $e) {
                    Log::error("Failed to send email to {$user->email}: " . $e->getMessage());
                    // Handle the error accordingly, such as updating a database record
                }
            }
        } catch (Exception $e) {

        }



    }
    //notify users of their proposal approval
    public function notifyusersproposalchangerequest($proposalid)
    {
        try {
            $proposal = Proposal::findOrFail($proposalid);
            if (!$proposal) {
                return;
            }
            $user = User::findOrFail($proposal->useridfk);
            if ($user) {
                // Define the data for the notification
                $level = 'success';
                $introLines = ['Your Proposal has been received and reviewed by the Committee!', 'Inregards to this there are some pending suggesstions made to your proposal.', 'Kindly login and revisit the changes as suggested.'];
                $actionUrl = route('pages.proposals.viewproposal', ['id' => $proposal->proposalid]);
                $actionText = 'View proposal';
                $outroLines = ['If you received this message mistakenly, Kindly Ignore and report to the Administrator to prevent receiving this mail again in future.'];
                $salutation = 'Best Regards';
                $subject = 'Proposal Review Notes';

                // Send the notification 
                try {
                    // notification instance
                    $personName = $user->name;
                    $greeting = 'Hello Dear, ' . $personName;
                    $notification = new ProposalSubmitted($subject, $greeting, $level, $introLines, $actionUrl, $actionText, $outroLines, $salutation);
                    // Notification::route('mail', $user->email)->notify($notification);
                    SendEmailNotification::dispatch($user->email, $notification);
                } catch (Exception $e) {
                    Log::error("Failed to send email to {$user->email}: " . $e->getMessage());
                    // Handle the error accordingly, such as updating a database record
                }
            }
        } catch (Exception $e) {


        }

    }

    ///general function for proposlas
    public function notifyUsersOfProposalActivity($activityname,$subject,$level,$introLines,$actionText,$actionUrl)
    {
        if (NotificationType::where('typename', $activityname)->exists()) {
            $not_type = NotificationType::where('typename', $activityname)->first();
            $users = $this->getNotificationTypeUsers($not_type->typeuuid); //->pluck('email')->toArray()
            // $emails = $this->getNotificationTypeUsers($not_type->typeuuid)->pluck('email')->toArray();
            $outroLines = ['If you received this message mistakenly, Kindly Ignore and report to the Administrator to prevent receiving this mail again in future.'];
            $salutation = 'Best Regards';
            // Send the notification to all email addresses
            foreach ($users as $user) {
                try {
                    // notification instance
                    $personName = $user->name;
                    $greeting = 'Hello Dear, ' . $personName;
                    $notification = new GeneralProposalAction($subject, $greeting, $level, $introLines, $actionUrl, $actionText, $outroLines, $salutation);
                    // Notification::route('mail', $user->email)->notify($notification);
                    SendEmailNotification::dispatch($user->email, $notification);
                } catch (Exception $e) {
                    Log::error("Failed to send email to {$user->email}: " . $e->getMessage());
                    // Handle the error accordingly, such as updating a database record
                }

            }
        }
    }
     //getmails with permission
     public function getNotificationTypeUsers($typeid)
     {
         // Fetch emails of users who have the specified permission
         $users = User::whereHas('notifiabletypes', function ($query) use ($typeid) {
             $query->where('notificationfk', $typeid);
         })->get();
 
         return $users;
     }
}
