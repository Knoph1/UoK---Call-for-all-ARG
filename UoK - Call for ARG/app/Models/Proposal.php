<?php

namespace App\Models;

use Auth;
use DateTime;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\ResearchTheme;



class Proposal extends Model
{
    use HasFactory;
    protected $table = 'proposals';

    // Use UUIDs instead of auto-incrementing IDs
    public $incrementing = false;
    protected $keyType = 'string';
    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'proposalid';


    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'proposalid',
        'grantnofk',
        'useridfk',
        'pfnofk',
        'themefk',
        'highqualification',
        'departmentidfk',
        'approvalstatus',
        'faxnumber',
        'cellphone',
        'officephone',
        'submittedstatus'
    ];



    //functions
    public function applicant()
    {
        return $this->belongsTo(User::class, 'useridfk', 'userid');
    }
    //functions
    public function department()
    {
        return $this->belongsTo(Department::class, 'departmentidfk', 'depid');
    }
    //functions
    public function grantitem()
    {
        return $this->belongsTo(Grant::class, 'grantnofk', 'grantid');
    }
    public function themeitem()
    {
        return $this->belongsTo(ResearchTheme::class, 'themefk', 'themeid');
    }

    public function collaborators()
    {
        return $this->hasMany(Collaborator::class, 'proposalidfk', 'proposalid');
    }
    public function publications()
    {
        return $this->hasMany(Publication::class, 'proposalidfk', 'proposalid');
    }
    
    public function expenditures()
    {
        return $this->hasMany(Expenditureitem::class, 'proposalidfk', 'proposalid');
    }
    public function researchdesigns()
    {
        return $this->hasMany(ResearchDesignItem::class, 'proposalidfk', 'proposalid');
    }
    public function workplans()
    {
        return $this->hasMany(Workplan::class, 'proposalidfk', 'proposalid');
    }
    public function researchProject()
    {
        return $this->belongsTo(ResearchProject::class, 'research_project_id', 'id');
    }
    public function proposalchanges()
    {
        return $this->belongsTo(ResearchTheme::class, 'themefk', 'themeid');
    }

    public function hasPendingUpdates()
    {
        try {
            $changes = $this->proposalchanges()->get();
            if ($changes->where('status', 'Pending')) {
                return true;
            }
            else {
                return false;
            }
        } catch (\Exception $exception) {
            return false;
        }

    }
    public function isApprovable()
    {
        try {
            $user = Auth::user();
            if (($user->userid == $this->useridfk) && $this->caneditstatus && $this->approvalstatus == 'Pending') {
                return true;
            }
            else {
                return false;
            }
        } catch (\Exception $exception) {
            return false;
        }

    }
}
