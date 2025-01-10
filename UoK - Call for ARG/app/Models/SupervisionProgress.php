<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupervisionProgress extends Model
{
    use HasFactory;
    protected $table = 'supervisionprogress';
    protected $primaryKey = 'id';

    // Define the fillable attributes
    protected $fillable = [
        'supervisorfk',
        'researchidfk',
        'report'
    ];
 
}
