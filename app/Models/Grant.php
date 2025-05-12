<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Grant extends Model
{
    use HasFactory;
    protected $table = 'grants';

    // Use UUIDs instead of auto-incrementing IDs
    public $incrementing = true;
    protected $keyType = 'int';
    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'grantid';


    public function proposals()
    {
        return $this->hasMany(Proposal::class,'grantnofk','grantid');
    }
    public function financialyear(){
        return $this->belongsTo(FinancialYear::class, 'finyearfk', 'id');

    }
}
