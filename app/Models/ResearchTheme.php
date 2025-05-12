<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResearchTheme extends Model
{
    use HasFactory;
    protected $table = 'researchthemes';
    protected $fillable = [
        'themename',        
        'applicablestatus',         
        'themedescription'
    ];




    //property functions
    //functions
    public function relatedproposals()
    {
        return $this->belongsToMany(Proposal::class, 'userpermissions', 'useridfk', 'permissionidfk');
    }
}
