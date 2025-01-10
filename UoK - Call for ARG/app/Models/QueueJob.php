<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QueueJob extends Model
{
    use HasFactory;
    protected $table = 'jobs';

    // Use UUIDs instead of auto-incrementing IDs
    public $incrementing = true;
    protected $keyType = 'int';
    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'id';
 
}
