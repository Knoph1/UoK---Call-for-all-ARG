<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class NotifiableUser extends Model
{
    use HasFactory;
    protected $table = 'notifiableusers';

    // Use UUIDs instead of auto-incrementing IDs
    public $incrementing = true; 

    public function applicant()
    {
        return $this->belongsTo(User::class, 'useridfk', 'userid');
    }
 
}
