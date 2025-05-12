<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GlobalSetting extends Model
{
    use HasFactory;
    protected $table = 'globalsettings';
 
    protected $primaryKey = 'id';


    public function getcurrentgrant()
    {
        return $this->where('item','current_open_grant')->first();
    }
    public function getcurrentfinyear()
    {
        return $this->where('item','current_fin_year')->first();
    }
}
