<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ProposalChangeMadeNotification extends Notification
{
    use Queueable;
    // properties
    public $greeting;
    public $level;
    public $introLines;
    public $actionUrl;
    public $actionText;
    public $outroLines;
    public $salutation;
    public $subject;
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($subject, $greeting, $level, $introLines, $actionUrl, $actionText, $outroLines, $salutation)
    {
        $this->greeting = $greeting;
        $this->level = $level;
        $this->introLines = $introLines;
        $this->actionUrl = $actionUrl;
        $this->actionText = $actionText;
        $this->outroLines = $outroLines;
        $this->salutation = $salutation;
        $this->subject = $subject;

    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject($this->subject)
            ->markdown('notifications.proposalchangemade', [
                'greeting' => $this->greeting,
                'level' => $this->level,
                'introLines' => $this->introLines,
                'actionUrl' => $this->actionUrl,
                'actionText' => $this->actionText,
                'outroLines' => $this->outroLines,
                'salutation' => $this->salutation,
                'displayableActionUrl' => $this->actionUrl, // Add this to show the URL as plain text
            ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
