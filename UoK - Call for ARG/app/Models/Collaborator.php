<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Collaborator extends Model
{
    use HasFactory;
    protected $table = 'collaborators';

    // Use UUIDs instead of auto-incrementing IDs
    public $incrementing = false;
    protected $keyType = 'string';
    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'collaboratorid';

    // Boot method to auto-generate UUIDs
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }



    protected $fillable = [
        'proposalidfk',        
        'collaboratorname',      
        'position',
        'institution',
        'researcharea',
        'experience'
    ];


    public function proposal()
    {
        return $this->belongsTo(Proposal::class, 'proposalidfk', 'proposalid');
    }
}
